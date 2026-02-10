/**
 * Comprehensive Unit Tests for n8n Workflow MCP Server
 * 
 * Tests all modules: helpers, collector, cleaner, classifier, composer, and MCP server.
 */

import { describe, it, expect } from 'vitest';
import { toolDefinitions } from '../../src/index';
import { log, setLogLevel } from '../../src/utils/logger';
import {
  textSimilarity, assessComplexity, generateEmbeddingText,
  stripCredentials, extractIntegrations, generateWorkflowId,
} from '../../src/utils/helpers';
import { getKnowledgeBaseTemplates, buildWorkflowJson } from '../../src/data-factory/collector';
import { validateWorkflow } from '../../src/composer/generator';
import type { N8nWorkflow, ValidateRequest } from '../../src/models/types';

// ============================================================================
// Utils: Logger Tests
// ============================================================================

describe('Logger', () => {
  it('should not throw on any log level', () => {
    setLogLevel('debug');
    expect(() => log('debug', 'test debug')).not.toThrow();
    expect(() => log('info', 'test info')).not.toThrow();
    expect(() => log('warn', 'test warn')).not.toThrow();
    expect(() => log('error', 'test error')).not.toThrow();
  });

  it('should accept optional data object', () => {
    expect(() => log('info', 'with data', { key: 'value', count: 42 })).not.toThrow();
  });
});

// ============================================================================
// Utils: Helper Tests
// ============================================================================

describe('Helpers', () => {
  describe('textSimilarity', () => {
    it('should return 1 for identical strings', () => {
      expect(textSimilarity('hello world', 'hello world')).toBe(1);
    });

    it('should return 0 for completely different strings', () => {
      expect(textSimilarity('abc', 'xyz')).toBe(0);
    });

    it('should return value between 0 and 1 for partial matches', () => {
      const score = textSimilarity('sync airtable sheets', 'airtable to google sheets sync');
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should be case-insensitive', () => {
      expect(textSimilarity('Hello World', 'hello world')).toBe(1);
    });
  });

  describe('assessComplexity', () => {
    it('should return beginner for simple workflows', () => {
      const workflow: N8nWorkflow = {
        name: 'Simple',
        nodes: [
          { name: 'Trigger', type: 'n8n-nodes-base.scheduleTrigger', position: [0, 0], parameters: {} },
          { name: 'Action', type: 'n8n-nodes-base.httpRequest', position: [200, 0], parameters: {} },
        ],
        connections: {},
      };
      expect(assessComplexity(workflow)).toBe('beginner');
    });

    it('should return intermediate for workflows with conditionals', () => {
      const workflow: N8nWorkflow = {
        name: 'Medium',
        nodes: [
          { name: 'Trigger', type: 'n8n-nodes-base.scheduleTrigger', position: [0, 0], parameters: {} },
          { name: 'IF', type: 'n8n-nodes-base.if', position: [200, 0], parameters: {} },
          { name: 'Action1', type: 'n8n-nodes-base.httpRequest', position: [400, 0], parameters: {} },
          { name: 'Action2', type: 'n8n-nodes-base.slack', position: [400, 200], parameters: {} },
          { name: 'End', type: 'n8n-nodes-base.noOp', position: [600, 0], parameters: {} },
        ],
        connections: {},
      };
      expect(assessComplexity(workflow)).toBe('intermediate');
    });

    it('should return advanced for complex workflows', () => {
      const nodes = Array.from({ length: 10 }, (_, i) => ({
        name: `Node${i}`,
        type: i === 2 ? 'n8n-nodes-base.if' : i === 5 ? 'n8n-nodes-base.splitInBatches' : 'n8n-nodes-base.httpRequest',
        position: [i * 200, 0] as [number, number],
        parameters: {},
      }));
      const workflow: N8nWorkflow = { name: 'Complex', nodes, connections: {} };
      expect(assessComplexity(workflow)).toBe('advanced');
    });
  });

  describe('generateEmbeddingText', () => {
    it('should combine name, description, category, and tags', () => {
      const text = generateEmbeddingText({
        name: 'Test Workflow',
        description: 'A test workflow for unit testing',
        category: 'Testing',
        tags: ['test', 'unit'],
      });
      expect(text).toContain('Test Workflow');
      expect(text).toContain('unit testing');
      expect(text).toContain('Testing');
      expect(text).toContain('test, unit');
    });

    it('should include node info when provided', () => {
      const text = generateEmbeddingText({
        name: 'WF',
        description: 'desc',
        category: 'cat',
        tags: [],
        nodes: [{ type: 'n8n-nodes-base.slack', name: 'Slack' }],
      });
      expect(text).toContain('Slack');
    });
  });

  describe('stripCredentials', () => {
    it('should remove credentials from all nodes', () => {
      const workflow: N8nWorkflow = {
        name: 'Test',
        nodes: [
          {
            name: 'Slack',
            type: 'n8n-nodes-base.slack',
            position: [0, 0],
            parameters: {},
            credentials: { slackApi: { id: 'secret123' } },
          },
        ],
        connections: {},
      };
      const cleaned = stripCredentials(workflow);
      expect(cleaned.nodes[0]!.credentials).toBeUndefined();
    });
  });

  describe('generateWorkflowId', () => {
    it('should generate a non-empty string', () => {
      const id = generateWorkflowId('Marketing', 'Email Campaign Automation');
      expect(id).toBeTruthy();
      expect(typeof id).toBe('string');
    });

    it('should produce different IDs for different inputs', () => {
      const id1 = generateWorkflowId('A', 'Test One');
      const id2 = generateWorkflowId('B', 'Test Two');
      expect(id1).not.toBe(id2);
    });
  });

  describe('extractIntegrations', () => {
    it('should extract service names from node types', () => {
      const workflow: N8nWorkflow = {
        name: 'Test',
        nodes: [
          { name: 'Slack', type: 'n8n-nodes-base.slack', position: [0, 0], parameters: {} },
          { name: 'GSheets', type: 'n8n-nodes-base.googleSheets', position: [200, 0], parameters: {} },
        ],
        connections: {},
      };
      const integrations = extractIntegrations(workflow);
      expect(integrations.length).toBeGreaterThan(0);
    });

    it('should skip utility nodes', () => {
      const workflow: N8nWorkflow = {
        name: 'Test',
        nodes: [
          { name: 'IF', type: 'n8n-nodes-base.if', position: [0, 0], parameters: {} },
          { name: 'Set', type: 'n8n-nodes-base.set', position: [200, 0], parameters: {} },
        ],
        connections: {},
      };
      const integrations = extractIntegrations(workflow);
      expect(integrations.length).toBe(0);
    });
  });
});

// ============================================================================
// Data Factory: Collector Tests
// ============================================================================

describe('Data Factory - Collector', () => {
  describe('getKnowledgeBaseTemplates', () => {
    const templates = getKnowledgeBaseTemplates();

    it('should return 30 templates (3 per category × 10 categories)', () => {
      expect(templates.length).toBe(30);
    });

    it('should cover all 10 categories', () => {
      const categories = new Set(templates.map(t => t.category));
      expect(categories.size).toBe(10);
      expect(categories.has('Data Synchronization')).toBe(true);
      expect(categories.has('Marketing Automation')).toBe(true);
      expect(categories.has('Customer Support')).toBe(true);
      expect(categories.has('Content Management')).toBe(true);
      expect(categories.has('E-commerce Operations')).toBe(true);
      expect(categories.has('DevOps & Monitoring')).toBe(true);
      expect(categories.has('Reporting & Analytics')).toBe(true);
      expect(categories.has('Lead Generation & CRM')).toBe(true);
      expect(categories.has('Notification Systems')).toBe(true);
      expect(categories.has('Document Processing')).toBe(true);
    });

    it('should have unique IDs', () => {
      const ids = templates.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('each template should have required fields', () => {
      for (const t of templates) {
        expect(t.id).toBeTruthy();
        expect(t.name).toBeTruthy();
        expect(t.category).toBeTruthy();
        expect(t.description).toBeTruthy();
        expect(t.use_cases.length).toBeGreaterThan(0);
        expect(t.nodes.length).toBeGreaterThan(0);
        expect(t.integrations.length).toBeGreaterThan(0);
        expect(t.tags.length).toBeGreaterThan(0);
        expect(['beginner', 'intermediate', 'advanced']).toContain(t.complexity);
        expect(t.pattern).toBeTruthy();
      }
    });

    it('should have 3 complexity levels distributed', () => {
      const beginner = templates.filter(t => t.complexity === 'beginner');
      const intermediate = templates.filter(t => t.complexity === 'intermediate');
      const advanced = templates.filter(t => t.complexity === 'advanced');
      expect(beginner.length).toBeGreaterThan(0);
      expect(intermediate.length).toBeGreaterThan(0);
      expect(advanced.length).toBeGreaterThan(0);
    });
  });

  describe('buildWorkflowJson', () => {
    const templates = getKnowledgeBaseTemplates();

    it('should generate valid n8n workflow JSON', () => {
      const template = templates[0]!;
      const workflow = buildWorkflowJson(template);
      expect(workflow.name).toBe(template.name);
      expect(workflow.nodes.length).toBe(template.nodes.length);
      expect(workflow.connections).toBeDefined();
      expect(workflow.settings).toBeDefined();
    });

    it('should chain nodes in connections', () => {
      const template = templates[0]!;
      const workflow = buildWorkflowJson(template);
      // Should have connections for all nodes except the last
      expect(Object.keys(workflow.connections).length).toBe(template.nodes.length - 1);
    });

    it('should position nodes left-to-right', () => {
      const template = templates[0]!;
      const workflow = buildWorkflowJson(template);
      for (let i = 1; i < workflow.nodes.length; i++) {
        expect(workflow.nodes[i]!.position[0]).toBeGreaterThan(workflow.nodes[i - 1]!.position[0]);
      }
    });

    it('should work for all 30 templates', () => {
      for (const template of templates) {
        const workflow = buildWorkflowJson(template);
        expect(workflow.name).toBe(template.name);
        expect(workflow.nodes.length).toBeGreaterThan(0);
      }
    });
  });
});

// ============================================================================
// Composer: Validation Tests
// ============================================================================

describe('Workflow Validator', () => {
  it('should validate a correct workflow', () => {
    const workflow: N8nWorkflow = {
      name: 'Valid Workflow',
      nodes: [
        { name: 'Webhook Trigger', type: 'n8n-nodes-base.webhookTrigger', position: [250, 300], parameters: {} },
        { name: 'HTTP Request', type: 'n8n-nodes-base.httpRequest', position: [450, 300], parameters: {} },
      ],
      connections: {
        'Webhook Trigger': { main: [[{ node: 'HTTP Request', type: 'main', index: 0 }]] },
      },
      settings: { executionOrder: 'v1' },
    };
    const result = validateWorkflow({ workflow });
    expect(result.is_valid).toBe(true);
    expect(result.issues.length).toBe(0);
  });

  it('should flag missing workflow name', () => {
    const workflow = { name: '', nodes: [{ name: 'N', type: 'T', position: [0, 0], parameters: {} }], connections: {} } as N8nWorkflow;
    const result = validateWorkflow({ workflow, checks: ['structure'] });
    expect(result.issues.some(i => i.message.includes('name'))).toBe(true);
  });

  it('should flag empty nodes array', () => {
    const workflow: N8nWorkflow = { name: 'Test', nodes: [], connections: {} };
    const result = validateWorkflow({ workflow, checks: ['structure'] });
    expect(result.issues.some(i => i.message.includes('no nodes'))).toBe(true);
  });

  it('should flag missing trigger node', () => {
    const workflow: N8nWorkflow = {
      name: 'No Trigger',
      nodes: [
        { name: 'Action', type: 'n8n-nodes-base.httpRequest', position: [0, 0], parameters: {} },
      ],
      connections: {},
    };
    const result = validateWorkflow({ workflow, checks: ['nodes'] });
    expect(result.warnings.some(w => w.message.includes('trigger'))).toBe(true);
  });

  it('should flag duplicate node names', () => {
    const workflow: N8nWorkflow = {
      name: 'Dups',
      nodes: [
        { name: 'Same', type: 'n8n-nodes-base.httpRequest', position: [0, 0], parameters: {} },
        { name: 'Same', type: 'n8n-nodes-base.httpRequest', position: [200, 0], parameters: {} },
      ],
      connections: {},
    };
    const result = validateWorkflow({ workflow, checks: ['nodes'] });
    expect(result.issues.some(i => i.message.includes('Duplicate'))).toBe(true);
  });

  it('should flag connections pointing to non-existent nodes', () => {
    const workflow: N8nWorkflow = {
      name: 'Bad Connection',
      nodes: [
        { name: 'NodeA', type: 'n8n-nodes-base.httpRequest', position: [0, 0], parameters: {} },
      ],
      connections: {
        'NodeA': { main: [[{ node: 'NonExistent', type: 'main', index: 0 }]] },
      },
    };
    const result = validateWorkflow({ workflow, checks: ['connections'] });
    expect(result.issues.some(i => i.message.includes('NonExistent'))).toBe(true);
  });

  it('should warn about missing settings', () => {
    const workflow: N8nWorkflow = {
      name: 'No Settings',
      nodes: [{ name: 'N', type: 'T', position: [0, 0], parameters: {} }],
      connections: {},
    };
    const result = validateWorkflow({ workflow, checks: ['structure'] });
    expect(result.warnings.some(w => w.message.includes('settings'))).toBe(true);
  });

  it('should run best_practices checks', () => {
    const nodes = Array.from({ length: 5 }, (_, i) => ({
      name: `Node${i}`, type: 'n8n-nodes-base.httpRequest',
      position: [i * 200, 0] as [number, number], parameters: {},
    }));
    const workflow: N8nWorkflow = { name: 'Test', nodes, connections: {}, settings: {} };
    const result = validateWorkflow({ workflow, checks: ['best_practices'] });
    expect(result.suggestions.some(s => s.includes('error handling'))).toBe(true);
  });
});

// ============================================================================
// MCP Server: Tool Definitions Tests
// ============================================================================

describe('MCP Server - Tool Definitions', () => {
  it('should export 6 tools', () => {
    expect(toolDefinitions.length).toBe(6);
  });

  it('should include all required tools', () => {
    const names = toolDefinitions.map(t => t.name);
    expect(names).toContain('compose_workflow');
    expect(names).toContain('search_workflows');
    expect(names).toContain('refine_workflow');
    expect(names).toContain('validate_workflow');
    expect(names).toContain('run_pipeline');
    expect(names).toContain('pipeline_status');
  });

  it('each tool should have name, description, and inputSchema', () => {
    for (const tool of toolDefinitions) {
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe('object');
    }
  });

  it('compose_workflow should require "request" parameter', () => {
    const tool = toolDefinitions.find(t => t.name === 'compose_workflow');
    expect(tool?.inputSchema.required).toContain('request');
  });

  it('search_workflows should require "query" parameter', () => {
    const tool = toolDefinitions.find(t => t.name === 'search_workflows');
    expect(tool?.inputSchema.required).toContain('query');
  });

  it('refine_workflow should require workflow_id and modifications', () => {
    const tool = toolDefinitions.find(t => t.name === 'refine_workflow');
    expect(tool?.inputSchema.required).toContain('workflow_id');
    expect(tool?.inputSchema.required).toContain('modifications');
  });

  it('validate_workflow should require "workflow" parameter', () => {
    const tool = toolDefinitions.find(t => t.name === 'validate_workflow');
    expect(tool?.inputSchema.required).toContain('workflow');
  });
});
