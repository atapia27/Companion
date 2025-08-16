import { AIRequest, AIResponse, ContextPassage, RetrievalSettings } from '@/types';

export class AIService {
  private static instance: AIService;
  private baseUrl: string;

  private constructor() {
    // Check if we're in development or production
    const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
    
    if (isDevelopment) {
      // Try to find the correct port for Netlify functions
      const port = window.location.port;
      const netlifyPort = port === '3000' ? '8888' : port === '3001' ? '8888' : port === '3002' ? '8888' : '8888';
      this.baseUrl = `http://localhost:${netlifyPort}/.netlify/functions`;
    } else {
      this.baseUrl = '/.netlify/functions';
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async askQuestion(
    question: string,
    context: ContextPassage[],
    collectionId: string,
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = 'gemini-2.0-flash-exp',
    settings?: Partial<RetrievalSettings>
  ): Promise<AIResponse> {
    const request: AIRequest = {
      question,
      context,
      collectionId,
      model,
      settings: {
        topK: 16,
        scoreThreshold: 0.1,
        useMMR: false,
        chunkSize: 4000,
        overlapSize: 200,
        ...settings,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (error) {
      console.error('AI service error:', error);
      throw new Error(`Failed to get AI response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async generateBriefing(
    collectionId: string,
    exchanges: any[],
    retrievedPassages: ContextPassage[],
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = 'gemini-2.0-flash-exp'
  ): Promise<AIResponse> {
    const request = {
      collectionId,
      exchanges,
      retrievedPassages,
      model,
      type: 'briefing',
    };

    try {
      const response = await fetch(`${this.baseUrl}/briefing`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AIResponse = await response.json();
      return data;
    } catch (error) {
      console.error('AI briefing generation error:', error);
      throw new Error(`Failed to generate briefing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async streamQuestion(
    question: string,
    context: ContextPassage[],
    collectionId: string,
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = 'gemini-2.0-flash-exp',
    settings?: Partial<RetrievalSettings>,
    onChunk?: (chunk: string) => void,
    onComplete?: (response: AIResponse) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    const request: AIRequest = {
      question,
      context,
      collectionId,
      model,
      settings: {
        topK: 16,
        scoreThreshold: 0.1,
        useMMR: false,
        chunkSize: 4000,
        overlapSize: 200,
        ...settings,
      },
    };

    try {
      const response = await fetch(`${this.baseUrl}/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body available for streaming');
      }

      const decoder = new TextDecoder();
      let buffer = '';
      let fullResponse = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              // Stream complete
              const finalResponse: AIResponse = {
                answer: fullResponse,
                citations: [], // Will be filled by the server
                followUpQuestions: [], // Will be filled by the server
                metadata: {
                  model,
                  tokens: 0, // Will be filled by the server
                  processingTime: 0, // Will be filled by the server
                },
              };
              onComplete?.(finalResponse);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                fullResponse += parsed.chunk;
                onChunk?.(parsed.chunk);
              }
            } catch (e) {
              console.warn('Failed to parse stream chunk:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('AI streaming error:', error);
      onError?.(error instanceof Error ? error : new Error('Unknown streaming error'));
    }
  }

  // Utility method to build context from retrieved chunks
  buildContextFromChunks(chunks: any[]): ContextPassage[] {
    return chunks.map((chunk, index) => ({
      id: chunk.id,
      text: chunk.text,
      source: {
        documentId: chunk.documentId,
        documentTitle: chunk.documentTitle || 'Unknown Document',
        chunkId: chunk.id,
        page: chunk.page,
      },
      score: chunk.score || 0,
    }));
  }

  // Method to estimate token usage
  estimateTokens(text: string): number {
    // Rough approximation: 1 token ≈ 4 characters for English text
    return Math.ceil(text.length / 4);
  }

  // Method to check if request would exceed token limits
  checkTokenLimits(
    question: string,
    context: ContextPassage[],
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b'
  ): { withinLimits: boolean; estimatedTokens: number; limit: number } {
    const contextText = context.map(c => c.text).join('\n\n');
    const totalText = `Question: ${question}\n\nContext:\n${contextText}`;
    const estimatedTokens = this.estimateTokens(totalText);

    const limits = {
      'gemini-2.0-flash-exp': 1048576, // 1M context window for Gemini 2.0 Flash
      'gpt-oss-20b': 131072, // 131k context window for gpt-oss-20b
    };

    const limit = limits[model];
    const withinLimits = estimatedTokens < limit * 0.8; // Leave 20% buffer

    return {
      withinLimits,
      estimatedTokens,
      limit,
    };
  }
}

export const aiService = AIService.getInstance();
