import { AIRequest, AIResponse, ContextPassage, RetrievalSettings } from '@/types';

export class AIService {
  private static instance: AIService;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_NETLIFY_FUNCTIONS_URL || '/.netlify/functions';
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  // Mock response generator for testing
  private generateMockResponse(type: 'chat' | 'briefing', question?: string, context?: ContextPassage[]): AIResponse {
    const mockResponses = {
      chat: {
        answer: `This is a mock response to: "${question || 'your question'}". 

Based on the provided context (${context?.length || 0} documents), here's what I found:

**Key Points:**
- This is a simulated response for testing purposes
- No real API calls were made
- The response simulates what you'd get from the actual AI service
- Context analysis would normally provide specific insights from your documents

**Sample Analysis:**
The documents appear to contain various types of content that would be analyzed for relevant information. In a real scenario, this would include specific citations and references to your uploaded materials.

**Next Steps:**
- Upload real documents to test the actual functionality
- Switch to a real AI model in the model selector to use actual API calls`,
        citations: context?.slice(0, 2).map((item, index) => ({
          id: `mock-citation-${index}`,
          chunkId: item.source.chunkId,
          documentId: item.source.documentId,
          text: `Sample citation ${index + 1} from ${item.source.documentTitle}`,
          score: 0.9 - (index * 0.1),
          page: item.source.page,
          location: {
            start: 0,
            end: 100
          }
        })) || [],
        followUpQuestions: [
          "Can you provide more details about the main findings?",
          "What are the key recommendations from this analysis?",
          "How does this relate to the overall project goals?"
        ],
        metadata: {
          model: 'gpt-oss-20b',
          tokens: 150,
          processingTime: 500
        }
      },
      briefing: {
        answer: `# Mock Summary Report

## Executive Summary
This is a simulated comprehensive briefing report generated for testing purposes. In a real scenario, this would analyze your uploaded documents and provide structured insights.

---

## Key Findings

### Document Analysis
| Document Type | Count | Status |
|---------------|-------|--------|
| Text Files | ${context?.filter(c => c.source.documentTitle.includes('.txt')).length || 0} | Processed |
| PDFs | ${context?.filter(c => c.source.documentTitle.includes('.pdf')).length || 0} | Processed |
| URLs | ${context?.filter(c => c.source.documentTitle.includes('http')).length || 0} | Processed |

### Content Overview
- **Total Documents**: ${context?.length || 0}
- **Analysis Date**: ${new Date().toLocaleDateString()}
- **Processing Method**: Mock API Simulation

---

## Main Insights

### 1. Document Structure
The uploaded content appears to contain various types of information that would be analyzed for patterns, themes, and key insights.

### 2. Information Quality
Based on the document count and types, the content would be evaluated for:
- Completeness of information
- Relevance to the analysis goals
- Consistency across sources

### 3. Potential Applications
The analyzed content could be used for:
- Research summaries
- Decision-making support
- Knowledge management
- Strategic planning

---

## Risk Assessment

### Low Risk
- Mock testing environment
- No sensitive data exposure
- Controlled testing conditions

### Medium Risk
- Limited real-world validation
- Simulated response patterns
- Testing-only functionality

---

## Recommendations

### Immediate Actions
1. **Switch to Real AI Model**: Select GPT-OSS-20B or Gemini 2.0 Flash from the model selector
2. **Upload Real Documents**: Test with actual content
3. **Validate Responses**: Compare mock vs real API behavior

### Testing Strategy
1. Use Mock API for UI/UX testing
2. Switch to real AI models for content validation
3. Monitor API usage and costs

---

## Conclusion
This mock briefing demonstrates the system's capability to generate structured reports. For production use, enable the real API and upload actual documents for genuine analysis and insights.

*Generated on ${new Date().toLocaleString()} using mock API simulation*`,
        citations: context?.map((item, index) => ({
          id: `mock-briefing-citation-${index}`,
          chunkId: item.source.chunkId,
          documentId: item.source.documentId,
          text: `Mock citation from ${item.source.documentTitle}`,
          score: 0.95 - (index * 0.05),
          page: item.source.page,
          location: {
            start: 0,
            end: 100
          }
        })) || [],
        followUpQuestions: [
          "What are the main themes across all documents?",
          "Which documents contain the most critical information?",
          "How can this analysis be applied to current projects?"
        ],
        metadata: {
          model: 'gpt-oss-20b',
          tokens: 450,
          processingTime: 2000
        }
      }
    };

    return mockResponses[type];
  }

  async askQuestion(
    question: string,
    context: ContextPassage[],
    collectionId: string,
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api' = 'gpt-oss-20b',
    settings?: Partial<RetrievalSettings>
  ): Promise<AIResponse> {
    // Use mock response if mock-api is selected
    if (model === 'mock-api') {
      console.log('🔧 Using mock API for chat question');
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      return this.generateMockResponse('chat', question, context);
    }

    // For real API calls, normalize model
    const apiModelAsk: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = model as 'gemini-2.0-flash-exp' | 'gpt-oss-20b';

    const request: AIRequest = {
      question,
      context,
      collectionId,
      model: apiModelAsk,
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
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api' = 'gpt-oss-20b'
  ): Promise<AIResponse> {
    // Use mock response if mock-api is selected
    if (model === 'mock-api') {
      console.log('🔧 Using mock API for briefing generation');
      // Simulate longer API delay for briefing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 1000));
      return this.generateMockResponse('briefing', undefined, retrievedPassages);
    }

    // For real API calls, normalize model
    const apiModel: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = model as 'gemini-2.0-flash-exp' | 'gpt-oss-20b';

    const request: any = {
      collectionId,
      exchanges,
      retrievedPassages,
      model: apiModel,
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
    model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api' = 'gpt-oss-20b',
    settings?: Partial<RetrievalSettings>,
    onChunk?: (chunk: string) => void,
    onComplete?: (response: AIResponse) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    // For real API calls, normalize model
    const apiModelStream: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' = model as 'gemini-2.0-flash-exp' | 'gpt-oss-20b';

    const request: AIRequest = {
      question,
      context,
      collectionId,
      model: apiModelStream,
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
