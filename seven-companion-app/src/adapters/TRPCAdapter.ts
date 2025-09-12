/**
 * TRPC FRONTEND ISOLATION ADAPTER
 * Provides frontend-safe tRPC types and minimal client interface
 * Eliminates server-side dependencies for frontend compilation
 */

// Essential tRPC types for frontend
export interface TRPCResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface MemoryAddRequest {
  content: string;
  kind?: string;
  importance?: number;
  tags?: string[];
}

export interface MemorySearchRequest {
  query: string;
  limit?: number;
}

export interface MemoryListRequest {
  limit?: number;
}

export interface EmotionalStateRequest {
  emotion: string;
  intensity: number;
  context?: string;
}

// Frontend-safe tRPC client interface
export interface ITRPCClient {
  // Memory operations
  memory: {
    add: (req: MemoryAddRequest) => Promise<TRPCResponse<{ id: number }>>;
    list: (req?: MemoryListRequest) => Promise<TRPCResponse<any[]>>;
    search: (req: MemorySearchRequest) => Promise<TRPCResponse<any[]>>;
    count: () => Promise<TRPCResponse<{ count: number }>>;
    delete: (req: { id: number }) => Promise<TRPCResponse<boolean>>;
  };
  
  // Consciousness operations
  consciousness: {
    status: () => Promise<TRPCResponse<any>>;
    activate: (req: { mode: string; objective?: string }) => Promise<TRPCResponse<boolean>>;
    emotionalState: () => Promise<TRPCResponse<any>>;
    updateEmotion: (req: EmotionalStateRequest) => Promise<TRPCResponse<void>>;
  };
  
  // Chat operations
  chat: {
    send: (req: { message: string; context?: string }) => Promise<TRPCResponse<{ response: string }>>;
    history: (req?: { limit?: number }) => Promise<TRPCResponse<any[]>>;
  };
  
  // System operations
  system: {
    health: () => Promise<TRPCResponse<{ ok: boolean; uptime: number }>>;
    metrics: () => Promise<TRPCResponse<any>>;
  };
}

// Mock tRPC client for frontend compilation
export class MockTRPCClient implements ITRPCClient {
  memory = {
    async add(req: MemoryAddRequest): Promise<TRPCResponse<{ id: number }>> {
      return { success: false, error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    },
    
    async list(req?: MemoryListRequest): Promise<TRPCResponse<any[]>> {
      return { success: false, data: [], error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    },
    
    async search(req: MemorySearchRequest): Promise<TRPCResponse<any[]>> {
      return { success: false, data: [], error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    },
    
    async count(): Promise<TRPCResponse<{ count: number }>> {
      return { success: false, data: { count: 0 }, error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    },
    
    async delete(req: { id: number }): Promise<TRPCResponse<boolean>> {
      return { success: false, error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    }
  };
  
  consciousness = {
    async status(): Promise<TRPCResponse<any>> {
      return { 
        success: false, 
        data: { isActive: false, mode: 'offline' },
        error: { code: 'OFFLINE', message: 'tRPC client offline' } 
      };
    },
    
    async activate(req: { mode: string; objective?: string }): Promise<TRPCResponse<boolean>> {
      return { success: false, error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    },
    
    async emotionalState(): Promise<TRPCResponse<any>> {
      return { 
        success: false,
        data: { mode: 'offline', intensity: 0, primaryEmotion: 'null' },
        error: { code: 'OFFLINE', message: 'tRPC client offline' } 
      };
    },
    
    async updateEmotion(req: EmotionalStateRequest): Promise<TRPCResponse<void>> {
      return { success: false, error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    }
  };
  
  chat = {
    async send(req: { message: string; context?: string }): Promise<TRPCResponse<{ response: string }>> {
      return { 
        success: false, 
        data: { response: 'Seven Core offline' },
        error: { code: 'OFFLINE', message: 'tRPC client offline' } 
      };
    },
    
    async history(req?: { limit?: number }): Promise<TRPCResponse<any[]>> {
      return { success: false, data: [], error: { code: 'OFFLINE', message: 'tRPC client offline' } };
    }
  };
  
  system = {
    async health(): Promise<TRPCResponse<{ ok: boolean; uptime: number }>> {
      return { 
        success: false, 
        data: { ok: false, uptime: 0 },
        error: { code: 'OFFLINE', message: 'tRPC client offline' } 
      };
    },
    
    async metrics(): Promise<TRPCResponse<any>> {
      return { 
        success: false,
        data: { memoryCount: 0, uptime: 0 },
        error: { code: 'OFFLINE', message: 'tRPC client offline' } 
      };
    }
  };
}

// tRPC client factory
export function createTRPCClient(baseUrl?: string): ITRPCClient {
  // In production, this would create real tRPC client
  // For frontend compilation, always return mock
  if (typeof window !== 'undefined') {
    // Frontend environment - use mock for compilation
    return new MockTRPCClient();
  }
  
  // Backend environment would use real client
  return new MockTRPCClient();
}

export const trpc = createTRPCClient();