/**
 * Data Factory - Embeddings Generator
 * 
 * Generates vector embeddings for workflows using Cloudflare AI
 * and stores them in Vectorize for semantic search.
 */

import type { Env, WorkflowRow } from '../models/types';
import { log } from '../utils/logger';
import { generateEmbeddingText } from '../utils/helpers';

/**
 * Generate embedding for a single text using Cloudflare AI
 */
async function generateEmbedding(env: Env, text: string): Promise<number[]> {
  const response = await env.AI.run('@cf/baai/bge-base-en-v1.5', {
    text: [text],
  }) as unknown as { data: number[][] };

  if (!response.data || response.data.length === 0) {
    throw new Error('No embedding returned from AI model');
  }

  return response.data[0] as number[];
}

/**
 * Generate embeddings for all classified workflows and store in Vectorize
 */
export async function generateAllEmbeddings(env: Env): Promise<{ embedded: number; failed: number }> {
  const rows = await env.DB.prepare(
    "SELECT * FROM workflows WHERE processing_status = 'classifying'"
  ).all<WorkflowRow>();

  let embedded = 0;
  let failed = 0;

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < rows.results.length; i += batchSize) {
    const batch = rows.results.slice(i, i + batchSize);

    const vectors: VectorizeVector[] = [];

    for (const row of batch) {
      try {
        const tags = row.tags ? JSON.parse(row.tags) as string[] : [];
        const text = generateEmbeddingText({
          name: row.name,
          description: row.description || '',
          category: row.category || '',
          tags,
        });

        const values = await generateEmbedding(env, text);
        const vectorId = `wf-${row.id}`;

        vectors.push({
          id: vectorId,
          values,
          metadata: {
            workflow_id: row.id,
            name: row.name,
            category: row.category || '',
            complexity: row.complexity || '',
            tags: tags.join(','),
          },
        });

        // Store embedding metadata in D1
        await env.DB.prepare(`
          INSERT OR REPLACE INTO embeddings_metadata 
          (workflow_id, vector_id, embedding_model, embedding_dimension, text_content)
          VALUES (?, ?, ?, ?, ?)
        `).bind(
          row.id,
          vectorId,
          '@cf/baai/bge-base-en-v1.5',
          768,
          text
        ).run();

        // Update workflow status
        await env.DB.prepare(`
          UPDATE workflows 
          SET processing_status = 'embedding',
              embedding_generated = 1,
              processed_at = datetime('now'),
              updated_at = datetime('now')
          WHERE id = ?
        `).bind(row.id).run();

        // Log processing
        await env.DB.prepare(`
          INSERT INTO processing_log (workflow_id, stage, status, metadata)
          VALUES (?, 'embed', 'success', ?)
        `).bind(row.id, JSON.stringify({ vector_id: vectorId, dimensions: 768 })).run();

        embedded++;
        log('info', `Generated embedding: ${row.name}`, { vectorId });
      } catch (error) {
        failed++;
        const errorMsg = error instanceof Error ? error.message : String(error);
        await env.DB.prepare(
          "INSERT INTO processing_log (workflow_id, stage, status, error_message) VALUES (?, 'embed', 'failed', ?)"
        ).bind(row.id, errorMsg).run();
        log('error', `Embedding failed: ${row.name}`, { error: errorMsg });
      }
    }

    // Batch upsert vectors into Vectorize
    if (vectors.length > 0) {
      try {
        await env.VECTORIZE.upsert(vectors);
        log('info', `Upserted ${vectors.length} vectors to Vectorize`);
      } catch (error) {
        log('error', 'Vectorize upsert failed', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  // Mark all successfully embedded workflows as ready
  await env.DB.prepare(`
    UPDATE workflows SET processing_status = 'ready' WHERE processing_status = 'embedding'
  `).run();

  log('info', 'Embedding generation complete', { embedded, failed });
  return { embedded, failed };
}
