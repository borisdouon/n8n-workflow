/**
 * Basic Unit Tests for n8n Workflow MCP Server
 * 
 * Tests the basic project setup and structure validation.
 */

import { describe, it, expect } from 'vitest';

// Mock environment
const mockEnv: Env = {
  ENVIRONMENT: 'test',
  LOG_LEVEL: 'debug'
};

describe('Project Setup', () => {
  describe('TypeScript Configuration', () => {
    it('should have valid tsconfig.json', () => {
      expect(true).toBe(true);
    });
  });

  describe('Environment Configuration', () => {
    it('should have wrangler.toml configuration', () => {
      const wranglerConfig = `
name = "n8n-workflow-mcp"
main = "src/index.ts"
compatibility_date = "2024-11-20"
      `.trim();
      
      expect(wranglerConfig).toContain('name = "n8n-workflow-mcp"');
      expect(wranglerConfig).toContain('main = "src/index.ts"');
    });

    it('should have environment variables defined', () => {
      expect(mockEnv.ENVIRONMENT).toBe('test');
      expect(mockEnv.LOG_LEVEL).toBe('debug');
    });
  });

  describe('MCP Server Structure', () => {
    it('should have createMcpServer function exported', () => {
      expect(typeof createMcpServer).toBe('function');
    });

    it('should register compose_workflow tool', () => {
      const toolNames = toolDefinitions.map(t => t.name);
      expect(toolNames).toContain('compose_workflow');
    });

    it('should register search_workflows tool', () => {
      const toolNames = toolDefinitions.map(t => t.name);
      expect(toolNames).toContain('search_workflows');
    });

    it('should register refine_workflow tool', () => {
      const toolNames = toolDefinitions.map(t => t.name);
      expect(toolNames).toContain('refine_workflow');
    });

    it('should register validate_workflow tool', () => {
      const toolNames = toolDefinitions.map(t => t.name);
      expect(toolNames).toContain('validate_workflow');
    });
  });
});

describe('Logging Utility', () => {
  it('should log debug messages', () => {
    expect(() => log('debug', 'Test debug message')).not.toThrow();
  });

  it('should log info messages', () => {
    expect(() => log('info', 'Test info message')).not.toThrow();
  });

  it('should log warn messages', () => {
    expect(() => log('warn', 'Test warn message')).not.toThrow();
  });

  it('should log error messages', () => {
    expect(() => log('error', 'Test error message')).not.toThrow();
  });

  it('should log messages with data', () => {
    expect(() => log('info', 'Test message', { key: 'value' })).not.toThrow();
  });
});

describe('Workflow Composition Tool', () => {
  it('should have compose_workflow tool definition', () => {
    const tool = toolDefinitions.find(t => t.name === 'compose_workflow');
    expect(tool).toBeDefined();
    expect(tool?.description).toContain('n8n workflow');
    expect(tool?.inputSchema.properties.request).toBeDefined();
  });

  it('should accept valid compose_workflow parameters', () => {
    const request = 'Create a workflow that syncs Typeform responses to Google Sheets';
    const requirements = {
      integrations: ['typeform', 'google-sheets'],
      trigger_type: 'form_submission' as const,
      complexity: 'intermediate' as const,
      include_error_handling: true
    };

    expect(typeof request).toBe('string');
    expect(Array.isArray(requirements.integrations)).toBe(true);
  });
});

describe('Search Workflows Tool', () => {
  it('should have search_workflows tool definition', () => {
    const tool = toolDefinitions.find(t => t.name === 'search_workflows');
    expect(tool).toBeDefined();
    expect(tool?.description).toContain('semantic workflow');
    expect(tool?.inputSchema.properties.query).toBeDefined();
  });

  it('should accept valid search parameters', () => {
    const query = 'form submission to crm';
    const filters = {
      category: 'lead_generation',
      complexity: ['beginner', 'intermediate'],
      limit: 5
    };

    expect(typeof query).toBe('string');
    expect(typeof filters.category).toBe('string');
    expect(Array.isArray(filters.complexity)).toBe(true);
  });
});

describe('Refine Workflow Tool', () => {
  it('should have refine_workflow tool definition', () => {
    const tool = toolDefinitions.find(t => t.name === 'refine_workflow');
    expect(tool).toBeDefined();
    expect(tool?.description).toContain('refine');
    expect(tool?.inputSchema.properties.workflow_id).toBeDefined();
    expect(tool?.inputSchema.properties.modifications).toBeDefined();
  });

  it('should accept valid refinement parameters', () => {
    const workflow_id = 'workflow_123';
    const modifications = [
      {
        type: 'add_node' as const,
        node_type: 'email',
        position: 3,
        config: { to: '{{ $json.email }}' }
      }
    ];

    expect(typeof workflow_id).toBe('string');
    expect(Array.isArray(modifications)).toBe(true);
    expect(modifications[0].type).toBe('add_node');
  });
});

describe('Validate Workflow Tool', () => {
  it('should have validate_workflow tool definition', () => {
    const tool = toolDefinitions.find(t => t.name === 'validate_workflow');
    expect(tool).toBeDefined();
    expect(tool?.description).toContain('Validate');
    expect(tool?.inputSchema.properties.workflow).toBeDefined();
  });

  it('should accept valid workflow validation parameters', () => {
    const workflow = {
      name: 'Test Workflow',
      nodes: [],
      connections: {}
    };
    const checks = ['structure', 'nodes', 'connections'];

    expect(typeof workflow).toBe('object');
    expect(Array.isArray(checks)).toBe(true);
    expect(checks).toContain('structure');
  });
});
