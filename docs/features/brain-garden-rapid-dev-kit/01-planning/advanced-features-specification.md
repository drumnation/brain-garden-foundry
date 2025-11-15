# Advanced Features Specification

**Version**: 1.0
**Status**: Planning
**Last Updated**: 2025-11-12
**Extends**: PRD.md (Base Feature Specification)

---

## Executive Summary

This document extends the base Brain Garden Rapid Dev Kit PRD with advanced enterprise-grade features that transform the kit from a "CRUD generator" into a "full-featured agentic application platform."

**Advanced Feature Areas**:
1. **Chat & Agent Interfaces** - Multiple agentic UI patterns with multi-model support
2. **MCP-Based Agent Manipulation** - Redux actions as MCP tools for direct app control
3. **Comprehensive Authentication** - Enterprise-grade auth with full user management
4. **Advanced Routing** - Nested routes, protected routes, layout-based routing
5. **Chart Libraries** - Integrated visualization options
6. **Infrastructure Flexibility** - Docker, local, cloud, and hybrid deployment options
7. **RAG Pipeline Integration** - Vector search and AI embeddings infrastructure

---

## 1. Chat & Agent Interface Architecture

### 1.1 Overview

The kit supports **three agentic UI patterns** that can be generated based on project requirements:

1. **Cursor-for-X Pattern** (Default) - VSCode-style split editor with agent chat
2. **Popup Agent Pattern** - Floating chat button → modal dialog
3. **Inline Agent Pattern** - Context-aware assistance embedded in UI

### 1.2 Cursor-for-X Pattern (Default)

**Use Case**: Applications where users need to work alongside an AI agent (CRM-for-X, IDE-for-X, Admin-for-X)

**Generated File Structure**:
```
src/
├── components/
│   ├── agent/
│   │   ├── AgentChat.tsx           # Main chat interface
│   │   ├── AgentMessage.tsx        # Message display component
│   │   ├── AgentToolCall.tsx       # MCP tool execution display
│   │   ├── AgentModelSelector.tsx  # Model switcher dropdown
│   │   ├── AgentProvider.tsx       # Context provider
│   │   └── AgentSplitLayout.tsx    # Split pane container
│   └── editor/
│       ├── MonacoEditor.tsx        # Code/text editor (optional)
│       └── ContentView.tsx         # Main content area
├── hooks/
│   ├── useAgent.ts                 # Agent interaction hook
│   ├── useAgentStream.ts           # SSE streaming hook
│   └── useAgentTools.ts            # MCP tool execution hook
├── services/
│   ├── agent/
│   │   ├── AgentService.ts         # Abstract agent interface
│   │   ├── ClaudeCodeAgent.ts      # Claude Code SDK implementation
│   │   ├── AnthropicAgent.ts       # Anthropic API implementation
│   │   ├── OpenAIAgent.ts          # OpenAI API implementation
│   │   ├── OpenRouterAgent.ts      # OpenRouter implementation
│   │   └── OllamaAgent.ts          # Ollama local models
│   └── mcp/
│       ├── MCPToolRegistry.ts      # Tool registration
│       └── MCPToolExecutor.ts      # Tool execution handler
└── types/
    ├── agent.types.ts              # Agent interfaces
    └── mcp.types.ts                # MCP tool types
```

**Component Example - AgentChat.tsx**:
```typescript
import { useState, useRef, useEffect } from 'react';
import { useAgent } from '@/hooks/useAgent';
import { useAgentTools } from '@/hooks/useAgentTools';
import { AgentMessage } from './AgentMessage';
import { AgentToolCall } from './AgentToolCall';

export const AgentChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { sendMessage, isStreaming } = useAgent();
  const { executeTool } = useAgentTools();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMessage]);

    // Stream response
    for await (const chunk of sendMessage(input)) {
      if (chunk.type === 'content') {
        setMessages(prev => {
          const updated = [...prev];
          const lastMsg = updated[updated.length - 1];
          lastMsg.content += chunk.delta;
          return updated;
        });
      } else if (chunk.type === 'tool_call') {
        // Execute MCP tool
        const result = await executeTool(chunk.tool_name, chunk.tool_input);
        setMessages(prev => [...prev, {
          id: crypto.randomUUID(),
          role: 'tool',
          toolName: chunk.tool_name,
          toolResult: result,
          timestamp: new Date(),
        }]);
      }
    }

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          msg.role === 'tool' ? (
            <AgentToolCall key={msg.id} message={msg} />
          ) : (
            <AgentMessage key={msg.id} message={msg} />
          )
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask the agent..."
            className="flex-1 px-4 py-2 border rounded-lg"
            disabled={isStreaming}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {isStreaming ? 'Sending...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

**Split Layout Component**:
```typescript
import { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { AgentChat } from './agent/AgentChat';
import { ContentView } from './editor/ContentView';

export const AgentSplitLayout = ({ children }: { children: React.ReactNode }) => {
  const [showAgent, setShowAgent] = useState(true);

  return (
    <PanelGroup direction="horizontal">
      {/* Main Content Area */}
      <Panel defaultSize={showAgent ? 60 : 100} minSize={30}>
        <div className="h-full overflow-auto">
          {children}
        </div>
      </Panel>

      {/* Agent Panel */}
      {showAgent && (
        <>
          <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-gray-300" />
          <Panel defaultSize={40} minSize={20}>
            <AgentChat />
          </Panel>
        </>
      )}
    </PanelGroup>
  );
};
```

### 1.3 Multi-Model Support

**Abstract Agent Interface**:
```typescript
// src/services/agent/AgentService.ts
export interface ChatChunk {
  type: 'content' | 'tool_call' | 'done' | 'error';
  delta?: string;
  tool_name?: string;
  tool_input?: any;
  error?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  capabilities: {
    tools: boolean;
    vision: boolean;
    streaming: boolean;
  };
}

export interface SendOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: MCPTool[];
}

export abstract class AgentService {
  abstract provider: string;

  abstract sendMessage(
    message: string,
    options?: SendOptions
  ): AsyncIterator<ChatChunk>;

  abstract listModels(): Promise<Model[]>;

  abstract executeFunction(
    name: string,
    args: any
  ): Promise<any>;
}
```

**Claude Code SDK Implementation** (Primary):
```typescript
// src/services/agent/ClaudeCodeAgent.ts
import { ClaudeCodeSDK } from '@anthropic/claude-code-sdk';
import { AgentService, ChatChunk, Model } from './AgentService';

export class ClaudeCodeAgent extends AgentService {
  provider = 'claude-code-sdk';
  private sdk: ClaudeCodeSDK;

  constructor() {
    super();
    // Uses Max subscription credentials automatically
    this.sdk = new ClaudeCodeSDK({
      useMaxSubscription: true,
    });
  }

  async *sendMessage(message: string, options?: SendOptions): AsyncIterator<ChatChunk> {
    try {
      const stream = await this.sdk.messages.stream({
        model: options?.model || 'claude-sonnet-4',
        messages: [{ role: 'user', content: message }],
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 1,
        tools: options?.tools,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          yield { type: 'content', delta: chunk.delta.text };
        } else if (chunk.type === 'tool_use') {
          yield {
            type: 'tool_call',
            tool_name: chunk.name,
            tool_input: chunk.input,
          };
        }
      }

      yield { type: 'done' };
    } catch (error) {
      yield { type: 'error', error: error.message };
    }
  }

  async listModels(): Promise<Model[]> {
    return [
      {
        id: 'claude-sonnet-4',
        name: 'Claude Sonnet 4',
        provider: 'anthropic',
        contextWindow: 200000,
        capabilities: { tools: true, vision: true, streaming: true },
      },
      {
        id: 'claude-opus-4',
        name: 'Claude Opus 4',
        provider: 'anthropic',
        contextWindow: 200000,
        capabilities: { tools: true, vision: true, streaming: true },
      },
    ];
  }

  async executeFunction(name: string, args: any): Promise<any> {
    // Handled by MCP tool executor
    throw new Error('Function execution should use MCPToolExecutor');
  }
}
```

**Anthropic API Implementation** (Fallback):
```typescript
// src/services/agent/AnthropicAgent.ts
import Anthropic from '@anthropic-ai/sdk';
import { AgentService, ChatChunk, Model } from './AgentService';

export class AnthropicAgent extends AgentService {
  provider = 'anthropic-api';
  private client: Anthropic;

  constructor(apiKey: string) {
    super();
    this.client = new Anthropic({ apiKey });
  }

  async *sendMessage(message: string, options?: SendOptions): AsyncIterator<ChatChunk> {
    try {
      const stream = await this.client.messages.stream({
        model: options?.model || 'claude-sonnet-4-20250514',
        messages: [{ role: 'user', content: message }],
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 1,
        tools: options?.tools,
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta') {
          yield { type: 'content', delta: chunk.delta.text };
        } else if (chunk.type === 'tool_use') {
          yield {
            type: 'tool_call',
            tool_name: chunk.name,
            tool_input: chunk.input,
          };
        }
      }

      yield { type: 'done' };
    } catch (error) {
      yield { type: 'error', error: error.message };
    }
  }

  async listModels(): Promise<Model[]> {
    // Static list - Anthropic doesn't have a models API
    return [
      {
        id: 'claude-sonnet-4-20250514',
        name: 'Claude Sonnet 4',
        provider: 'anthropic',
        contextWindow: 200000,
        capabilities: { tools: true, vision: true, streaming: true },
      },
      {
        id: 'claude-opus-4-20250514',
        name: 'Claude Opus 4',
        provider: 'anthropic',
        contextWindow: 200000,
        capabilities: { tools: true, vision: true, streaming: true },
      },
    ];
  }

  async executeFunction(name: string, args: any): Promise<any> {
    throw new Error('Function execution should use MCPToolExecutor');
  }
}
```

**OpenAI API Implementation**:
```typescript
// src/services/agent/OpenAIAgent.ts
import OpenAI from 'openai';
import { AgentService, ChatChunk, Model } from './AgentService';

export class OpenAIAgent extends AgentService {
  provider = 'openai-api';
  private client: OpenAI;

  constructor(apiKey: string) {
    super();
    this.client = new OpenAI({ apiKey });
  }

  async *sendMessage(message: string, options?: SendOptions): AsyncIterator<ChatChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: options?.model || 'gpt-4-turbo',
        messages: [{ role: 'user', content: message }],
        max_tokens: options?.maxTokens || 4096,
        temperature: options?.temperature || 1,
        tools: options?.tools?.map(tool => ({
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          },
        })),
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta;
        if (delta?.content) {
          yield { type: 'content', delta: delta.content };
        } else if (delta?.tool_calls) {
          for (const toolCall of delta.tool_calls) {
            yield {
              type: 'tool_call',
              tool_name: toolCall.function.name,
              tool_input: JSON.parse(toolCall.function.arguments),
            };
          }
        }
      }

      yield { type: 'done' };
    } catch (error) {
      yield { type: 'error', error: error.message };
    }
  }

  async listModels(): Promise<Model[]> {
    const response = await this.client.models.list();
    return response.data
      .filter(m => m.id.startsWith('gpt-'))
      .map(m => ({
        id: m.id,
        name: m.id,
        provider: 'openai',
        contextWindow: 128000, // Default
        capabilities: { tools: true, vision: false, streaming: true },
      }));
  }

  async executeFunction(name: string, args: any): Promise<any> {
    throw new Error('Function execution should use MCPToolExecutor');
  }
}
```

**OpenRouter Implementation** (Unified Interface):
```typescript
// src/services/agent/OpenRouterAgent.ts
import { AgentService, ChatChunk, Model } from './AgentService';

export class OpenRouterAgent extends AgentService {
  provider = 'openrouter';
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async *sendMessage(message: string, options?: SendOptions): AsyncIterator<ChatChunk> {
    try {
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: options?.model || 'anthropic/claude-sonnet-4',
          messages: [{ role: 'user', content: message }],
          max_tokens: options?.maxTokens || 4096,
          temperature: options?.temperature || 1,
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim().startsWith('data:'));

        for (const line of lines) {
          const data = line.replace('data: ', '');
          if (data === '[DONE]') {
            yield { type: 'done' };
            return;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed.choices[0]?.delta?.content;
            if (delta) {
              yield { type: 'content', delta };
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      yield { type: 'error', error: error.message };
    }
  }

  async listModels(): Promise<Model[]> {
    const response = await fetch(`${this.baseURL}/models`, {
      headers: { 'Authorization': `Bearer ${this.apiKey}` },
    });

    const data = await response.json();
    return data.data.map(m => ({
      id: m.id,
      name: m.name || m.id,
      provider: m.id.split('/')[0],
      contextWindow: m.context_length || 128000,
      capabilities: {
        tools: m.supports_tools || false,
        vision: m.supports_vision || false,
        streaming: true,
      },
    }));
  }

  async executeFunction(name: string, args: any): Promise<any> {
    throw new Error('Function execution should use MCPToolExecutor');
  }
}
```

**Ollama Implementation** (Local Models):
```typescript
// src/services/agent/OllamaAgent.ts
import { AgentService, ChatChunk, Model } from './AgentService';

export class OllamaAgent extends AgentService {
  provider = 'ollama';
  private baseURL: string;

  constructor(baseURL = 'http://localhost:11434') {
    super();
    this.baseURL = baseURL;
  }

  async *sendMessage(message: string, options?: SendOptions): AsyncIterator<ChatChunk> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: options?.model || 'llama3.1',
          messages: [{ role: 'user', content: message }],
          stream: true,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line);
            if (parsed.message?.content) {
              yield { type: 'content', delta: parsed.message.content };
            }
            if (parsed.done) {
              yield { type: 'done' };
              return;
            }
          } catch (e) {
            // Skip malformed JSON
          }
        }
      }
    } catch (error) {
      yield { type: 'error', error: error.message };
    }
  }

  async listModels(): Promise<Model[]> {
    const response = await fetch(`${this.baseURL}/api/tags`);
    const data = await response.json();

    return data.models.map(m => ({
      id: m.name,
      name: m.name,
      provider: 'ollama',
      contextWindow: 128000,
      capabilities: { tools: false, vision: false, streaming: true },
    }));
  }

  async executeFunction(name: string, args: any): Promise<any> {
    throw new Error('Ollama does not support function calling');
  }
}
```

### 1.4 Agent Provider Factory

**Dynamic Provider Selection**:
```typescript
// src/services/agent/AgentFactory.ts
import { AgentService } from './AgentService';
import { ClaudeCodeAgent } from './ClaudeCodeAgent';
import { AnthropicAgent } from './AnthropicAgent';
import { OpenAIAgent } from './OpenAIAgent';
import { OpenRouterAgent } from './OpenRouterAgent';
import { OllamaAgent } from './OllamaAgent';

export type AgentProvider =
  | 'claude-code-sdk'
  | 'anthropic-api'
  | 'openai-api'
  | 'openrouter'
  | 'ollama';

export interface AgentConfig {
  provider: AgentProvider;
  apiKey?: string;
  baseURL?: string;
  useMaxSubscription?: boolean;
}

export class AgentFactory {
  static create(config: AgentConfig): AgentService {
    switch (config.provider) {
      case 'claude-code-sdk':
        return new ClaudeCodeAgent();

      case 'anthropic-api':
        if (!config.apiKey) {
          throw new Error('Anthropic API key required');
        }
        return new AnthropicAgent(config.apiKey);

      case 'openai-api':
        if (!config.apiKey) {
          throw new Error('OpenAI API key required');
        }
        return new OpenAIAgent(config.apiKey);

      case 'openrouter':
        if (!config.apiKey) {
          throw new Error('OpenRouter API key required');
        }
        return new OpenRouterAgent(config.apiKey);

      case 'ollama':
        return new OllamaAgent(config.baseURL);

      default:
        throw new Error(`Unknown provider: ${config.provider}`);
    }
  }
}
```

**React Hook for Agent**:
```typescript
// src/hooks/useAgent.ts
import { useState, useCallback, useRef } from 'react';
import { AgentFactory, AgentProvider } from '@/services/agent/AgentFactory';
import { AgentService, ChatChunk } from '@/services/agent/AgentService';

export const useAgent = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentProvider, setCurrentProvider] = useState<AgentProvider>('claude-code-sdk');
  const agentRef = useRef<AgentService>(AgentFactory.create({ provider: 'claude-code-sdk' }));

  const switchProvider = useCallback((provider: AgentProvider, apiKey?: string) => {
    agentRef.current = AgentFactory.create({ provider, apiKey });
    setCurrentProvider(provider);
  }, []);

  const sendMessage = useCallback(async function* (message: string) {
    setIsStreaming(true);
    try {
      for await (const chunk of agentRef.current.sendMessage(message)) {
        yield chunk;
      }
    } finally {
      setIsStreaming(false);
    }
  }, []);

  return {
    sendMessage,
    isStreaming,
    currentProvider,
    switchProvider,
  };
};
```

### 1.5 Backend API for Agent

**Express Routes**:
```typescript
// server/routes/agent.routes.ts
import { Router } from 'express';
import { AgentFactory } from '../services/agent/AgentFactory';
import { MCPToolExecutor } from '../services/mcp/MCPToolExecutor';

const router = Router();

// POST /api/agent/chat - Send message
router.post('/chat', async (req, res) => {
  const { message, provider, apiKey, model } = req.body;

  const agent = AgentFactory.create({ provider, apiKey });
  const chunks: string[] = [];

  for await (const chunk of agent.sendMessage(message, { model })) {
    chunks.push(JSON.stringify(chunk));
  }

  res.json({ chunks });
});

// GET /api/agent/stream - SSE streaming
router.get('/stream', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const { message, provider, apiKey, model } = req.query;

  const agent = AgentFactory.create({
    provider: provider as any,
    apiKey: apiKey as string,
  });

  for await (const chunk of agent.sendMessage(message as string, { model: model as string })) {
    res.write(`data: ${JSON.stringify(chunk)}\n\n`);
  }

  res.end();
});

// POST /api/agent/tools - Execute MCP tool
router.post('/tools', async (req, res) => {
  const { toolName, toolInput } = req.body;

  try {
    const executor = new MCPToolExecutor();
    const result = await executor.execute(toolName, toolInput);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/agent/models - List available models
router.get('/models', async (req, res) => {
  const { provider, apiKey } = req.query;

  try {
    const agent = AgentFactory.create({
      provider: provider as any,
      apiKey: apiKey as string,
    });

    const models = await agent.listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/agent/provider - Switch provider
router.post('/provider', async (req, res) => {
  const { provider, apiKey } = req.body;

  try {
    // Validate provider by attempting to create agent
    AgentFactory.create({ provider, apiKey });
    res.json({ success: true, provider });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;
```

### 1.6 UI Library Integration

**Assistant UI (shadcn/ui chatbot kit)** - Primary recommendation:
```bash
npm install @assistant-ui/react
```

**Features**:
- Pre-built chat components (message list, input, bubbles)
- Streaming support out of the box
- Markdown rendering
- Code syntax highlighting
- File attachments
- Tool call display

**Alternative Libraries**:
1. **react-chat-elements** - Lightweight, customizable
2. **@chatscope/chat-ui-kit-react** - Enterprise-grade, accessible
3. **Custom** - Full control, built with Mantine components

---

## 2. MCP-Based Agent Manipulation

### 2.1 Overview

The kit generates a **Redux → MCP Tools pipeline** that allows agents to directly manipulate the application by exposing Redux actions as MCP tools.

**Benefits**:
- Agents can create, update, delete records without manual API calls
- Type-safe tool definitions generated from Redux slices
- Real-time UI updates via Redux store
- Complete audit trail of agent actions

### 2.2 Architecture

```
┌─────────────────┐
│   Agent Chat    │
│   Component     │
└────────┬────────┘
         │ 1. User asks agent to create customer
         ↓
┌─────────────────┐
│  Claude/GPT/etc │
│   LLM Model     │
└────────┬────────┘
         │ 2. LLM decides to call tool
         ↓
┌─────────────────┐
│ MCPToolExecutor │
│  (Backend)      │
└────────┬────────┘
         │ 3. Dispatch Redux action
         ↓
┌─────────────────┐
│  Redux Store    │
│   (Frontend)    │
└────────┬────────┘
         │ 4. UI updates automatically
         ↓
┌─────────────────┐
│  Customer List  │
│   Component     │
└─────────────────┘
```

### 2.3 Generated File Structure

```
src/
├── store/
│   ├── slices/
│   │   ├── customers.slice.ts      # Redux slice
│   │   ├── orders.slice.ts
│   │   └── products.slice.ts
│   ├── mcp/
│   │   ├── tools/
│   │   │   ├── customers.tools.ts  # MCP tool definitions
│   │   │   ├── orders.tools.ts
│   │   │   └── products.tools.ts
│   │   ├── MCPToolRegistry.ts      # Central registry
│   │   └── MCPToolExecutor.ts      # Execution handler
│   └── store.ts                    # Store configuration
server/
├── mcp/
│   ├── MCPServer.ts                # MCP protocol server
│   ├── ToolRegistry.ts             # Server-side registry
│   └── ToolExecutor.ts             # Server-side execution
```

### 2.4 Redux Slice Example

```typescript
// src/store/slices/customers.slice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface CustomersState {
  items: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  items: [],
  loading: false,
  error: null,
};

const customersSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    createCustomer: (state, action: PayloadAction<Omit<Customer, 'id' | 'createdAt'>>) => {
      const newCustomer: Customer = {
        id: crypto.randomUUID(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.items.push(newCustomer);
    },

    updateCustomer: (state, action: PayloadAction<{ id: string; data: Partial<Customer> }>) => {
      const customer = state.items.find(c => c.id === action.payload.id);
      if (customer) {
        Object.assign(customer, action.payload.data);
      }
    },

    deleteCustomer: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    },

    setCustomers: (state, action: PayloadAction<Customer[]>) => {
      state.items = action.payload;
    },
  },
});

export const {
  createCustomer,
  updateCustomer,
  deleteCustomer,
  setCustomers,
} = customersSlice.actions;

export default customersSlice.reducer;
```

### 2.5 MCP Tools Generation

**Automatic tool generation from Redux slice**:
```typescript
// src/store/mcp/tools/customers.tools.ts
import { MCPTool } from '@/types/mcp.types';
import { createCustomer, updateCustomer, deleteCustomer } from '@/store/slices/customers.slice';

export const customerTools: MCPTool[] = [
  {
    name: 'create_customer',
    description: 'Create a new customer in the CRM system',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Full name of the customer',
        },
        email: {
          type: 'string',
          description: 'Email address',
        },
        phone: {
          type: 'string',
          description: 'Phone number',
        },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
          description: 'Customer status',
        },
      },
      required: ['name', 'email'],
    },
    handler: async (args, { dispatch }) => {
      dispatch(createCustomer(args));
      return {
        success: true,
        message: `Customer ${args.name} created successfully`,
      };
    },
  },

  {
    name: 'update_customer',
    description: 'Update an existing customer',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Customer ID',
        },
        name: { type: 'string' },
        email: { type: 'string' },
        phone: { type: 'string' },
        status: {
          type: 'string',
          enum: ['active', 'inactive'],
        },
      },
      required: ['id'],
    },
    handler: async (args, { dispatch }) => {
      const { id, ...data } = args;
      dispatch(updateCustomer({ id, data }));
      return {
        success: true,
        message: `Customer ${id} updated successfully`,
      };
    },
  },

  {
    name: 'delete_customer',
    description: 'Delete a customer from the system',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Customer ID to delete',
        },
      },
      required: ['id'],
    },
    handler: async (args, { dispatch }) => {
      dispatch(deleteCustomer(args.id));
      return {
        success: true,
        message: `Customer ${args.id} deleted successfully`,
      };
    },
  },

  {
    name: 'search_customers',
    description: 'Search customers by name, email, or phone',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Search query',
        },
      },
      required: ['query'],
    },
    handler: async (args, { getState }) => {
      const state = getState();
      const query = args.query.toLowerCase();

      const results = state.customers.items.filter(c =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.includes(query)
      );

      return {
        success: true,
        results,
        count: results.length,
      };
    },
  },
];
```

### 2.6 MCP Tool Registry

```typescript
// src/store/mcp/MCPToolRegistry.ts
import { MCPTool } from '@/types/mcp.types';
import { customerTools } from './tools/customers.tools';
import { orderTools } from './tools/orders.tools';
import { productTools } from './tools/products.tools';

export class MCPToolRegistry {
  private tools: Map<string, MCPTool> = new Map();

  constructor() {
    this.registerTools([
      ...customerTools,
      ...orderTools,
      ...productTools,
    ]);
  }

  registerTools(tools: MCPTool[]) {
    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }
  }

  getTool(name: string): MCPTool | undefined {
    return this.tools.get(name);
  }

  getAllTools(): MCPTool[] {
    return Array.from(this.tools.values());
  }

  getToolDefinitions(): Array<{
    name: string;
    description: string;
    inputSchema: any;
  }> {
    return this.getAllTools().map(tool => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema,
    }));
  }
}
```

### 2.7 MCP Tool Executor

```typescript
// src/store/mcp/MCPToolExecutor.ts
import { MCPToolRegistry } from './MCPToolRegistry';
import { store } from '../store';

export class MCPToolExecutor {
  private registry: MCPToolRegistry;

  constructor() {
    this.registry = new MCPToolRegistry();
  }

  async execute(toolName: string, args: any): Promise<any> {
    const tool = this.registry.getTool(toolName);

    if (!tool) {
      throw new Error(`Tool not found: ${toolName}`);
    }

    // Validate input against schema
    this.validateInput(args, tool.inputSchema);

    // Execute tool handler with dispatch and getState
    const result = await tool.handler(args, {
      dispatch: store.dispatch,
      getState: store.getState,
    });

    return result;
  }

  private validateInput(args: any, schema: any): void {
    // Basic validation - in production use ajv or zod
    const required = schema.required || [];

    for (const field of required) {
      if (!(field in args)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  getAvailableTools() {
    return this.registry.getToolDefinitions();
  }
}
```

### 2.8 Backend MCP Server

```typescript
// server/mcp/MCPServer.ts
import express from 'express';
import { MCPToolExecutor } from '../../src/store/mcp/MCPToolExecutor';

export class MCPServer {
  private app: express.Application;
  private executor: MCPToolExecutor;

  constructor() {
    this.app = express();
    this.executor = new MCPToolExecutor();
    this.setupRoutes();
  }

  private setupRoutes() {
    // List available tools
    this.app.get('/mcp/tools', (req, res) => {
      const tools = this.executor.getAvailableTools();
      res.json({ tools });
    });

    // Execute tool
    this.app.post('/mcp/execute', async (req, res) => {
      const { toolName, args } = req.body;

      try {
        const result = await this.executor.execute(toolName, args);
        res.json({ success: true, result });
      } catch (error) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
      }
    });
  }

  listen(port: number) {
    this.app.listen(port, () => {
      console.log(`MCP Server listening on port ${port}`);
    });
  }
}
```

### 2.9 Agent Integration

**Using MCP Tools with Agent**:
```typescript
// src/hooks/useAgentTools.ts
import { useCallback } from 'react';
import { MCPToolExecutor } from '@/store/mcp/MCPToolExecutor';

export const useAgentTools = () => {
  const executor = new MCPToolExecutor();

  const executeTool = useCallback(async (toolName: string, args: any) => {
    try {
      const result = await executor.execute(toolName, args);
      return result;
    } catch (error) {
      console.error(`Tool execution failed: ${toolName}`, error);
      throw error;
    }
  }, []);

  const getAvailableTools = useCallback(() => {
    return executor.getAvailableTools();
  }, []);

  return {
    executeTool,
    getAvailableTools,
  };
};
```

**Sending Tools to Agent**:
```typescript
// In AgentChat component
const { executeTool, getAvailableTools } = useAgentTools();
const { sendMessage } = useAgent();

const handleSend = async () => {
  const tools = getAvailableTools();

  for await (const chunk of sendMessage(input, { tools })) {
    if (chunk.type === 'tool_call') {
      const result = await executeTool(chunk.tool_name, chunk.tool_input);
      // Display result in chat
    }
  }
};
```

---

## 3. Comprehensive Authentication Architecture

### 3.1 Overview

The kit generates a **full enterprise-grade authentication system** with all features needed for production applications.

**Features**:
- User registration with email verification
- Login with JWT tokens
- Password reset flow
- Magic link authentication
- OAuth integration (Google, GitHub)
- User profile management
- Protected routes with guards
- Role-based access control (RBAC)
- CSRF protection
- Rate limiting
- Brandable UI components

### 3.2 Generated File Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   ├── MagicLinkForm.tsx
│   │   ├── EmailVerificationPrompt.tsx
│   │   └── OAuthButtons.tsx
│   ├── profile/
│   │   ├── ProfileDropdown.tsx      # Navbar dropdown
│   │   ├── ProfileSettings.tsx      # Edit profile
│   │   ├── SecuritySettings.tsx     # Change password
│   │   ├── AvatarUpload.tsx
│   │   └── DeleteAccount.tsx
│   ├── guards/
│   │   ├── ProtectedRoute.tsx       # Require auth
│   │   ├── RoleGuard.tsx            # Require role
│   │   └── GuestRoute.tsx           # Redirect if logged in
│   └── layouts/
│       ├── MarketingLayout.tsx      # For logged-out users
│       ├── AuthLayout.tsx           # For login/signup pages
│       └── DashboardLayout.tsx      # For logged-in users
├── hooks/
│   ├── useAuth.ts                   # Auth context hook
│   ├── useUser.ts                   # Current user hook
│   └── usePermissions.ts            # RBAC hook
├── services/
│   └── auth/
│       ├── AuthService.ts           # API calls
│       ├── TokenService.ts          # JWT management
│       └── OAuthService.ts          # OAuth flows
├── context/
│   └── AuthContext.tsx              # Global auth state
└── types/
    └── auth.types.ts                # Auth interfaces

server/
├── routes/
│   ├── auth.routes.ts               # Auth endpoints
│   └── profile.routes.ts            # Profile endpoints
├── middleware/
│   ├── authenticate.ts              # JWT verification
│   ├── authorize.ts                 # Role checking
│   ├── rateLimiter.ts               # Rate limiting
│   └── csrf.ts                      # CSRF protection
├── services/
│   ├── AuthService.ts               # Business logic
│   ├── TokenService.ts              # JWT generation
│   ├── EmailService.ts              # Email sending
│   └── OAuthService.ts              # OAuth providers
└── models/
    ├── User.model.ts                # User entity
    └── Session.model.ts             # Session tracking
```

### 3.3 Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Magic link tokens
CREATE TABLE magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- OAuth accounts
CREATE TABLE oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- Sessions (optional, for tracking active sessions)
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  last_activity TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token);
CREATE INDEX idx_oauth_accounts_user_id ON oauth_accounts(user_id);
```

### 3.4 Backend Authentication Endpoints

```typescript
// server/routes/auth.routes.ts
import { Router } from 'express';
import { AuthService } from '../services/AuthService';
import { authenticate } from '../middleware/authenticate';
import { rateLimiter } from '../middleware/rateLimiter';
import { csrfProtection } from '../middleware/csrf';

const router = Router();
const authService = new AuthService();

// POST /api/auth/register - Create new account
router.post('/register',
  rateLimiter({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 min
  async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Validate input
      if (!email || !password || !name) {
        return res.status(400).json({
          success: false,
          error: 'Email, password, and name are required',
        });
      }

      // Create user
      const result = await authService.register({ email, password, name });

      res.json({
        success: true,
        message: 'Account created. Please check your email to verify your account.',
        userId: result.userId,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// POST /api/auth/login - Login with email/password
router.post('/login',
  rateLimiter({ max: 10, windowMs: 15 * 60 * 1000 }), // 10 requests per 15 min
  async (req, res) => {
    try {
      const { email, password, remember } = req.body;

      const result = await authService.login({ email, password, remember });

      res.json({
        success: true,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// POST /api/auth/logout - Logout (invalidate tokens)
router.post('/logout', authenticate, async (req, res) => {
  try {
    await authService.logout(req.user.id, req.token);

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/refresh - Refresh access token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    const result = await authService.refreshToken(refreshToken);

    res.json({
      success: true,
      accessToken: result.accessToken,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/forgot-password - Request password reset
router.post('/forgot-password',
  rateLimiter({ max: 3, windowMs: 60 * 60 * 1000 }), // 3 requests per hour
  async (req, res) => {
    try {
      const { email } = req.body;

      await authService.sendPasswordResetEmail(email);

      // Always return success to prevent email enumeration
      res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    } catch (error) {
      // Still return success even on error
      res.json({
        success: true,
        message: 'If an account exists with that email, a password reset link has been sent.',
      });
    }
  }
);

// POST /api/auth/reset-password - Reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/auth/magic-link - Request magic link
router.post('/magic-link',
  rateLimiter({ max: 3, windowMs: 15 * 60 * 1000 }), // 3 requests per 15 min
  async (req, res) => {
    try {
      const { email } = req.body;

      await authService.sendMagicLink(email);

      res.json({
        success: true,
        message: 'Magic link sent to your email',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
);

// GET /api/auth/magic-link/:token - Login with magic link
router.get('/magic-link/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const result = await authService.loginWithMagicLink(token);

    // Redirect to app with tokens in query params (or set cookies)
    res.redirect(`/dashboard?access_token=${result.accessToken}&refresh_token=${result.refreshToken}`);
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// GET /api/auth/verify-email/:token - Verify email
router.get('/verify-email/:token', async (req, res) => {
  try {
    const { token } = req.params;

    await authService.verifyEmail(token);

    res.redirect('/login?verified=true');
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// OAuth routes
// GET /api/auth/oauth/google - Initiate Google OAuth
router.get('/oauth/google', (req, res) => {
  const authUrl = authService.getGoogleOAuthUrl();
  res.redirect(authUrl);
});

// GET /api/auth/oauth/google/callback - Google OAuth callback
router.get('/oauth/google/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const result = await authService.handleGoogleCallback(code as string);

    res.redirect(`/dashboard?access_token=${result.accessToken}&refresh_token=${result.refreshToken}`);
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

// GET /api/auth/oauth/github - Initiate GitHub OAuth
router.get('/oauth/github', (req, res) => {
  const authUrl = authService.getGitHubOAuthUrl();
  res.redirect(authUrl);
});

// GET /api/auth/oauth/github/callback - GitHub OAuth callback
router.get('/oauth/github/callback', async (req, res) => {
  try {
    const { code } = req.query;

    const result = await authService.handleGitHubCallback(code as string);

    res.redirect(`/dashboard?access_token=${result.accessToken}&refresh_token=${result.refreshToken}`);
  } catch (error) {
    res.redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
});

export default router;
```

### 3.5 Profile Management Endpoints

```typescript
// server/routes/profile.routes.ts
import { Router } from 'express';
import { ProfileService } from '../services/ProfileService';
import { authenticate } from '../middleware/authenticate';
import { upload } from '../middleware/upload'; // multer for file uploads

const router = Router();
const profileService = new ProfileService();

// All routes require authentication
router.use(authenticate);

// POST /api/profile/update - Update profile
router.post('/update', async (req, res) => {
  try {
    const { name, email } = req.body;

    const updatedUser = await profileService.updateProfile(req.user.id, {
      name,
      email,
    });

    res.json({
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/profile/change-password - Change password
router.post('/change-password', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    await profileService.changePassword(req.user.id, currentPassword, newPassword);

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/profile/upload-avatar - Upload profile picture
router.post('/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const avatarUrl = await profileService.uploadAvatar(req.user.id, req.file);

    res.json({
      success: true,
      avatarUrl,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

// DELETE /api/profile/delete-account - Delete account
router.delete('/delete-account', async (req, res) => {
  try {
    const { password } = req.body;

    await profileService.deleteAccount(req.user.id, password);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
```

### 3.6 Frontend Auth Components

**Login Form**:
```typescript
// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password, remember);
      // Redirect handled by AuthContext
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Sign In</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm">Remember me</span>
          </label>

          <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </div>

      <div className="mt-6">
        <OAuthButtons />
      </div>
    </div>
  );
};
```

**Signup Form**:
```typescript
// src/components/auth/SignupForm.tsx
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export const SignupForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    try {
      await register({ name, email, password });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a verification link to <strong>{email}</strong>.
          Please check your inbox and click the link to verify your account.
        </p>
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Account</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Sign in
        </Link>
      </div>

      <div className="mt-6">
        <OAuthButtons />
      </div>
    </div>
  );
};
```

**Profile Dropdown (Navbar)**:
```typescript
// src/components/profile/ProfileDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

export const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
      >
        <img
          src={user?.avatarUrl || '/default-avatar.png'}
          alt={user?.name}
          className="w-8 h-8 rounded-full"
        />
        <span className="hidden md:block">{user?.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-3 border-b">
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="py-1">
            <Link
              to="/dashboard/profile"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Profile Settings
            </Link>
            <Link
              to="/dashboard/security"
              className="block px-4 py-2 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Security
            </Link>
          </div>

          <div className="border-t py-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
```

**Protected Route Guard**:
```typescript
// src/components/guards/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

**Role Guard**:
```typescript
// src/components/guards/RoleGuard.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RoleGuardProps {
  children: React.ReactNode;
  role: string | string[];
}

export const RoleGuard = ({ children, role }: RoleGuardProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const allowedRoles = Array.isArray(role) ? role : [role];
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

---

## 4. Advanced Routing Architecture

### 4.1 Overview

The kit generates **four routing patterns** to support various application structures:

1. **Flat Routing** - Simple, top-level routes
2. **Nested Routing** - Parent layouts with child routes
3. **Protected Routing** - Authentication and role-based guards
4. **Layout-Based Routing** - Multiple layouts for different sections

### 4.2 Complete Routing Example

```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/guards/ProtectedRoute';
import { RoleGuard } from '@/components/guards/RoleGuard';
import { GuestRoute } from '@/components/guards/GuestRoute';

// Layouts
import { MarketingLayout } from '@/components/layouts/MarketingLayout';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { AdminLayout } from '@/components/layouts/AdminLayout';

// Marketing Pages
import { Home } from '@/pages/Home';
import { Pricing } from '@/pages/Pricing';
import { Features } from '@/pages/Features';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Signup } from '@/pages/auth/Signup';
import { ForgotPassword } from '@/pages/auth/ForgotPassword';
import { ResetPassword } from '@/pages/auth/ResetPassword';

// Dashboard Pages
import { DashboardOverview } from '@/pages/dashboard/Overview';
import { DashboardCustomers } from '@/pages/dashboard/Customers';
import { DashboardOrders } from '@/pages/dashboard/Orders';

// Settings Pages (Nested)
import { SettingsOverview } from '@/pages/dashboard/settings/Overview';
import { ProfileSettings } from '@/pages/dashboard/settings/Profile';
import { SecuritySettings } from '@/pages/dashboard/settings/Security';
import { BillingSettings } from '@/pages/dashboard/settings/Billing';

// Admin Pages
import { AdminUsers } from '@/pages/admin/Users';
import { AdminAnalytics } from '@/pages/admin/Analytics';

export const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Marketing Routes (Public) */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
          </Route>

          {/* Auth Routes (Guest Only - redirect if logged in) */}
          <Route element={<GuestRoute><AuthLayout /></GuestRoute>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* Dashboard Routes (Protected) */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<DashboardOverview />} />
            <Route path="/dashboard/customers" element={<DashboardCustomers />} />
            <Route path="/dashboard/orders" element={<DashboardOrders />} />

            {/* Nested Settings Routes */}
            <Route path="/dashboard/settings">
              <Route index element={<SettingsOverview />} />
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="security" element={<SecuritySettings />} />
              <Route path="billing" element={<BillingSettings />} />
            </Route>
          </Route>

          {/* Admin Routes (Role-Protected) */}
          <Route element={<RoleGuard role="admin"><AdminLayout /></RoleGuard>}>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
```

### 4.3 Layout Components

**Marketing Layout** (for logged-out users):
```typescript
// src/components/layouts/MarketingLayout.tsx
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export const MarketingLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            YourApp
          </Link>

          <nav className="hidden md:flex gap-6">
            <Link to="/features" className="hover:text-blue-600">Features</Link>
            <Link to="/pricing" className="hover:text-blue-600">Pricing</Link>
          </nav>

          <div className="flex gap-2">
            {user ? (
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 hover:bg-gray-100 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 YourApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
```

**Dashboard Layout** (for logged-in users):
```typescript
// src/components/layouts/DashboardLayout.tsx
import { Outlet, Link, useLocation } from 'react-router-dom';
import { ProfileDropdown } from '@/components/profile/ProfileDropdown';

const navigation = [
  { name: 'Overview', path: '/dashboard' },
  { name: 'Customers', path: '/dashboard/customers' },
  { name: 'Orders', path: '/dashboard/orders' },
  { name: 'Settings', path: '/dashboard/settings' },
];

export const DashboardLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <h1 className="text-xl font-bold">YourApp</h1>
        </div>

        <nav className="mt-8">
          {navigation.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 ${
                location.pathname === item.path
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Nav */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex-1" />
          <ProfileDropdown />
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
```

### 4.4 Navigation Utilities

**Breadcrumbs** (auto-generated from route hierarchy):
```typescript
// src/components/navigation/Breadcrumbs.tsx
import { Link, useLocation } from 'react-router-dom';

export const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  const breadcrumbNameMap: Record<string, string> = {
    dashboard: 'Dashboard',
    customers: 'Customers',
    orders: 'Orders',
    settings: 'Settings',
    profile: 'Profile',
    security: 'Security',
    billing: 'Billing',
  };

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-4">
      <Link to="/" className="hover:text-blue-600">
        Home
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const label = breadcrumbNameMap[value] || value;

        return (
          <div key={to} className="flex items-center">
            <span className="mx-2">/</span>
            {isLast ? (
              <span className="text-gray-900 font-medium">{label}</span>
            ) : (
              <Link to={to} className="hover:text-blue-600">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};
```

---

## 5. Chart Libraries Integration

### 5.1 Overview

The kit provides **two chart library options** with complete TypeScript support and responsive design:

1. **Recharts** (Default) - React-native declarative charts
2. **Chart.js** (Alternative) - Canvas-based with react-chartjs-2

### 5.2 Recharts Integration (Default)

**Installation**:
```bash
npm install recharts
```

**Generated Components**:
```
src/
├── components/
│   └── charts/
│       ├── LineChart.tsx
│       ├── BarChart.tsx
│       ├── PieChart.tsx
│       ├── AreaChart.tsx
│       └── ComposedChart.tsx
```

**Example - LineChart Component**:
```typescript
// src/components/charts/LineChart.tsx
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: Array<{ key: string; color: string; name: string }>;
  height?: number;
}

export const LineChart = ({ data, xKey, yKeys, height = 300 }: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        {yKeys.map(({ key, color, name }) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={color}
            name={name}
            strokeWidth={2}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};
```

**Usage Example**:
```typescript
// src/pages/dashboard/Analytics.tsx
import { LineChart } from '@/components/charts/LineChart';

const data = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
];

export const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Revenue vs. Expenses</h1>

      <LineChart
        data={data}
        xKey="month"
        yKeys={[
          { key: 'revenue', color: '#3b82f6', name: 'Revenue' },
          { key: 'expenses', color: '#ef4444', name: 'Expenses' },
        ]}
        height={400}
      />
    </div>
  );
};
```

### 5.3 Chart.js Integration (Alternative)

**Installation**:
```bash
npm install chart.js react-chartjs-2
```

**Generated Components**:
```
src/
├── components/
│   └── charts/
│       ├── LineChartJS.tsx
│       ├── BarChartJS.tsx
│       ├── PieChartJS.tsx
│       └── DoughnutChartJS.tsx
```

**Example - LineChart Component**:
```typescript
// src/components/charts/LineChartJS.tsx
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartJSProps {
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor?: string;
    }>;
  };
  height?: number;
}

export const LineChartJS = ({ data, height = 300 }: LineChartJSProps) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height }}>
      <Line options={options} data={data} />
    </div>
  );
};
```

---

## 6. Infrastructure Flexibility

### 6.1 Overview

The kit supports **four deployment modes**:

1. **Local Development** - SQLite, file storage, no containers
2. **Docker Compose** - Complete stack including RAG pipeline
3. **Cloud Native** - Managed services (AWS, GCP, Azure)
4. **Hybrid** - Mix of local and cloud services

### 6.2 Docker Compose Configuration

**Complete Stack with RAG**:
```yaml
# docker-compose.yml
version: '3.8'

services:
  # Application
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/myapp
      - REDIS_URL=redis://redis:6379
      - QDRANT_URL=http://qdrant:6333
      - OLLAMA_URL=http://ollama:11434
      - SMTP_HOST=mailhog
      - SMTP_PORT=1025
    depends_on:
      - db
      - redis
      - qdrant
      - ollama
    volumes:
      - .:/app
      - /app/node_modules

  # PostgreSQL Database
  db:
    image: postgres:15
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis (caching, sessions, queues)
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Qdrant (vector database for RAG)
  qdrant:
    image: qdrant/qdrant:latest
    ports:
      - "6333:6333"
      - "6334:6334"
    volumes:
      - qdrant_data:/qdrant/storage

  # Ollama (local LLM embeddings)
  ollama:
    image: ollama/ollama:latest
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    command: serve

  # MailHog (email testing)
  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"  # SMTP
      - "8025:8025"  # Web UI

  # MinIO (S3-compatible object storage)
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
  ollama_data:
  minio_data:
```

### 6.3 RAG Pipeline Integration

**Vector Search Service**:
```typescript
// server/services/VectorSearchService.ts
import { QdrantClient } from '@qdrant/js-client-rest';

export class VectorSearchService {
  private client: QdrantClient;
  private collectionName = 'documents';

  constructor() {
    this.client = new QdrantClient({
      url: process.env.QDRANT_URL || 'http://localhost:6333',
    });
  }

  async initialize() {
    // Create collection if not exists
    const collections = await this.client.getCollections();
    const exists = collections.collections.some(
      c => c.name === this.collectionName
    );

    if (!exists) {
      await this.client.createCollection(this.collectionName, {
        vectors: {
          size: 1536, // OpenAI ada-002 embedding size
          distance: 'Cosine',
        },
      });
    }
  }

  async addDocuments(documents: Array<{ id: string; text: string; metadata?: any }>) {
    const embeddings = await this.generateEmbeddings(documents.map(d => d.text));

    const points = documents.map((doc, i) => ({
      id: doc.id,
      vector: embeddings[i],
      payload: {
        text: doc.text,
        ...doc.metadata,
      },
    }));

    await this.client.upsert(this.collectionName, {
      points,
    });
  }

  async search(query: string, limit = 10) {
    const [queryEmbedding] = await this.generateEmbeddings([query]);

    const results = await this.client.search(this.collectionName, {
      vector: queryEmbedding,
      limit,
    });

    return results.map(r => ({
      id: r.id,
      score: r.score,
      text: r.payload?.text,
      metadata: r.payload,
    }));
  }

  private async generateEmbeddings(texts: string[]): Promise<number[][]> {
    // Use Ollama for local embeddings
    const response = await fetch(`${process.env.OLLAMA_URL}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: texts,
      }),
    });

    const data = await response.json();
    return data.embedding;
  }
}
```

### 6.4 Environment Configuration

**Development (.env.local)**:
```bash
# Database
DATABASE_URL=sqlite:./dev.db

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# Email (MailHog)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@yourapp.com

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Agent
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OPENROUTER_API_KEY=

# RAG
QDRANT_URL=http://localhost:6333
OLLAMA_URL=http://localhost:11434

# Storage
STORAGE_TYPE=local
STORAGE_PATH=./uploads
```

**Production (.env.production)**:
```bash
# Database (managed PostgreSQL)
DATABASE_URL=postgresql://user:password@prod-db.example.com:5432/myapp

# Redis (managed)
REDIS_URL=redis://prod-redis.example.com:6379

# Auth
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=7d

# Email (SendGrid/AWS SES)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=<sendgrid-api-key>
SMTP_FROM=noreply@yourapp.com

# OAuth
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-client-secret>
GITHUB_CLIENT_ID=<production-client-id>
GITHUB_CLIENT_SECRET=<production-client-secret>

# Agent
ANTHROPIC_API_KEY=<production-key>
OPENAI_API_KEY=<production-key>
OPENROUTER_API_KEY=<production-key>

# RAG (managed Qdrant Cloud)
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=<api-key>
OLLAMA_URL=https://your-ollama-instance.com

# Storage (S3/Cloud Storage)
STORAGE_TYPE=s3
AWS_ACCESS_KEY_ID=<access-key>
AWS_SECRET_ACCESS_KEY=<secret-key>
AWS_BUCKET_NAME=yourapp-uploads
AWS_REGION=us-east-1
```

---

## 7. Testing Strategy

### 7.1 Overview

Every generated feature includes **comprehensive tests**:

1. **Unit Tests** - Component and function tests (Vitest)
2. **Integration Tests** - API endpoint tests (Supertest)
3. **E2E Tests** - User workflow tests (Playwright)

### 7.2 Example Test Files

**Auth Service Unit Tests**:
```typescript
// server/services/__tests__/AuthService.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../AuthService';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
  });

  describe('register', () => {
    it('should create a new user', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });

      expect(result.userId).toBeDefined();
    });

    it('should reject duplicate email', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });

      await expect(
        authService.register({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User 2',
        })
      ).rejects.toThrow('Email already exists');
    });

    it('should hash password', async () => {
      const result = await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });

      const user = await db.users.findById(result.userId);
      expect(user.passwordHash).not.toBe('Password123!');
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });

      const result = await authService.login({
        email: 'test@example.com',
        password: 'Password123!',
      });

      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
      expect(result.user.email).toBe('test@example.com');
    });

    it('should reject invalid password', async () => {
      await authService.register({
        email: 'test@example.com',
        password: 'Password123!',
        name: 'Test User',
      });

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
      ).rejects.toThrow('Invalid credentials');
    });
  });
});
```

**Agent Chat E2E Tests**:
```typescript
// e2e/agent-chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Agent Chat', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should send message and receive response', async ({ page }) => {
    // Type message
    await page.fill('[data-testid="chat-input"]', 'Hello, agent!');
    await page.click('[data-testid="send-button"]');

    // Wait for response
    await page.waitForSelector('[data-testid="assistant-message"]', {
      timeout: 10000,
    });

    // Verify response appears
    const messages = await page.locator('[data-testid="assistant-message"]').count();
    expect(messages).toBeGreaterThan(0);
  });

  test('should execute MCP tool', async ({ page }) => {
    // Send message that triggers tool
    await page.fill('[data-testid="chat-input"]', 'Create a customer named John Doe');
    await page.click('[data-testid="send-button"]');

    // Wait for tool execution display
    await page.waitForSelector('[data-testid="tool-execution"]', {
      timeout: 10000,
    });

    // Verify tool was called
    const toolName = await page.locator('[data-testid="tool-name"]').textContent();
    expect(toolName).toBe('create_customer');

    // Verify result
    const toolResult = await page.locator('[data-testid="tool-result"]').textContent();
    expect(toolResult).toContain('success');
  });

  test('should switch models', async ({ page }) => {
    // Open model selector
    await page.click('[data-testid="model-selector"]');

    // Select different model
    await page.click('[data-testid="model-option-gpt-4"]');

    // Verify model changed
    const currentModel = await page.locator('[data-testid="current-model"]').textContent();
    expect(currentModel).toBe('GPT-4');
  });
});
```

---

## 8. Generator CLI Commands

### 8.1 Overview

The Brain Garden Rapid Dev Kit provides a **comprehensive CLI** for generating all advanced features.

### 8.2 Command Reference

**Generate Full Stack with Advanced Features**:
```bash
npx brain-garden-kit create my-app \
  --template crm \
  --agent cursor-for-x \
  --auth comprehensive \
  --routing advanced \
  --charts recharts \
  --infrastructure docker \
  --rag true
```

**Options**:
- `--template` - Base template (crm, admin, saas, dashboard)
- `--agent` - Agent pattern (cursor-for-x, popup, inline, all)
- `--models` - Model support (claude-code-sdk, anthropic-api, openai-api, all)
- `--auth` - Auth level (minimal, standard, comprehensive)
- `--routing` - Routing complexity (flat, nested, advanced, all)
- `--charts` - Chart library (recharts, chartjs, both)
- `--infrastructure` - Deployment (local, docker, cloud, hybrid)
- `--rag` - Include RAG pipeline (true/false)

**Generate Individual Features**:
```bash
# Generate cursor-for-X agent pattern
npx brain-garden-kit add agent --pattern cursor-for-x

# Generate comprehensive auth
npx brain-garden-kit add auth --level comprehensive

# Generate advanced routing
npx brain-garden-kit add routing --complexity advanced

# Generate chart components
npx brain-garden-kit add charts --library recharts

# Generate Docker Compose with RAG
npx brain-garden-kit add infrastructure --mode docker --rag true
```

---

## 9. Summary & Next Steps

### 9.1 What We've Defined

This Advanced Features Specification extends the base Brain Garden Rapid Dev Kit with:

1. ✅ **Chat & Agent Interfaces** - 3 UI patterns with multi-model support
2. ✅ **MCP-Based Manipulation** - Redux actions as MCP tools
3. ✅ **Comprehensive Auth** - Enterprise-grade authentication system
4. ✅ **Advanced Routing** - 4 routing patterns with guards and layouts
5. ✅ **Chart Libraries** - Recharts and Chart.js integration
6. ✅ **Infrastructure Options** - Local, Docker, Cloud, Hybrid
7. ✅ **RAG Pipeline** - Vector search with Qdrant and Ollama

### 9.2 Implementation Phases

**Phase 1: Agent System** (Weeks 1-2)
- Implement AgentService abstraction
- Build Claude Code SDK, Anthropic, OpenAI, OpenRouter, Ollama providers
- Create cursor-for-X UI pattern
- Develop MCP tool registry and executor

**Phase 2: Authentication** (Weeks 3-4)
- Database schema and migrations
- Backend auth endpoints
- Frontend auth components
- OAuth integration
- Email services

**Phase 3: Routing & UI** (Week 5)
- Route guards and layouts
- Navigation components
- Chart library integration

**Phase 4: Infrastructure** (Week 6)
- Docker Compose configuration
- RAG pipeline setup
- Environment configuration
- Deployment guides

**Phase 5: Generator** (Week 7-8)
- CLI command structure
- Template generation logic
- Testing and documentation

### 9.3 Documentation Updates Needed

1. Update base PRD to reference this specification
2. Create implementation guides for each feature area
3. Generate API documentation
4. Write deployment guides
5. Create video tutorials

---

**Document Status**: Complete
**Next Action**: Review with stakeholders, then proceed to implementation planning
