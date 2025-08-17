import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { aiService } from '@/lib/ai-service';
import { FileProcessingResult } from '@/types';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function useChatMessages(processedContent: FileProcessingResult[]) {
  // Testing flag - set to false when done testing
  const ENABLE_MOCK_CHAT_HISTORY = false;

  const mockChatHistory: ChatMessage[] = [
    {
      id: '1',
      type: 'user',
      content: 'What are the main features of this document?',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
    },
    {
      id: '2',
      type: 'assistant',
      content: 'Based on the uploaded document, the main features include:\n\n1. **AI-Powered Analysis**: Advanced machine learning algorithms for content processing\n2. **Multi-Format Support**: Handles PDF, DOCX, TXT, and image files\n3. **Real-time Chat**: Interactive conversation with your content\n4. **Smart Summarization**: Automatic generation of key insights and briefings\n5. **Context-Aware Responses**: AI that understands the full context of your documents\n\nWould you like me to elaborate on any specific feature?',
      timestamp: new Date(Date.now() - 240000), // 4 minutes ago
    },
    {
      id: '3',
      type: 'user',
      content: 'Can you explain how the context management works?',
      timestamp: new Date(Date.now() - 180000), // 3 minutes ago
    },
    {
      id: '4',
      type: 'assistant',
      content: 'The context management system works through several key components:\n\n**Document Processing Pipeline**:\n- Files are uploaded and processed through OCR and text extraction\n- Content is chunked into manageable segments while preserving context\n- Metadata is extracted and stored for efficient retrieval\n\n**Intelligent Indexing**:\n- Vector embeddings are created for semantic search capabilities\n- Keywords and topics are automatically identified and tagged\n- Cross-references between documents are established\n\n**Dynamic Context Assembly**:\n- When you ask questions, the system retrieves relevant chunks\n- Context is assembled from multiple sources when needed\n- The AI receives comprehensive context to provide accurate answers\n\nThis ensures that responses are always grounded in your actual content.',
      timestamp: new Date(Date.now() - 120000), // 2 minutes ago
    },
    {
      id: '5',
      type: 'user',
      content: 'What about the security and privacy features?',
      timestamp: new Date(Date.now() - 60000), // 1 minute ago
    },
    {
      id: '6',
      type: 'assistant',
      content: 'Security and privacy are top priorities in this system:\n\n**Data Protection**:\n- All uploaded documents are processed locally when possible\n- Encryption at rest and in transit using industry-standard protocols\n- No data is stored permanently unless explicitly requested\n\n**Privacy Controls**:\n- User data is never shared with third parties\n- Processing is done in isolated environments\n- Automatic data cleanup after processing sessions\n\n**Access Control**:\n- Session-based authentication\n- Granular permissions for document access\n- Audit trails for all interactions\n\n**Compliance**:\n- GDPR and CCPA compliant\n- SOC 2 Type II certified infrastructure\n- Regular security audits and penetration testing\n\nThe system is designed to handle sensitive documents while maintaining the highest security standards.',
      timestamp: new Date(Date.now() - 30000), // 30 seconds ago
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(
    ENABLE_MOCK_CHAT_HISTORY ? mockChatHistory : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (content: string, model: string) => {
    if (!content.trim() || isLoading) return;

    if (processedContent.length === 0) {
      toast({
        title: "No content available",
        description: "Please upload some documents or URLs first.",
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Create a mock collection ID for this session
      const collectionId = 'temp-collection-' + Date.now();
      
      // Prepare context from content
      const context = processedContent.map((item, index) => ({
        id: `content-${index}`,
        text: item.text,
        source: {
          documentId: `doc-${index}`,
          documentTitle: item.metadata.customName || item.metadata.filename || item.metadata.summary || `Content ${index + 1}`,
          chunkId: `chunk-${index}`,
        },
        score: 1.0,
      }));

      // Ask question using AI service
      const response = await aiService.askQuestion(
        content.trim(),
        context,
        collectionId,
        model as 'gemini-2.0-flash-exp' | 'gpt-oss-20b'
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error asking question",
        description: error instanceof Error ? error.message : "Failed to get answer",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
  };
}
