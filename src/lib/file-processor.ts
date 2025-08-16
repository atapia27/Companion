import mammoth from 'mammoth';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';
import { FileProcessingResult, ProcessingProgress, DocumentMetadata } from '@/types';

// Set up PDF.js worker - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export class FileProcessor {
  private static instance: FileProcessor;

  static getInstance(): FileProcessor {
    if (!FileProcessor.instance) {
      FileProcessor.instance = new FileProcessor();
    }
    return FileProcessor.instance;
  }

  async processFile(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<FileProcessingResult> {
    try {
      onProgress?.({
        stage: 'uploading',
        progress: 0,
        message: 'Processing file...',
      });

      const result = await this.extractText(file, onProgress);

      onProgress?.({
        stage: 'complete',
        progress: 100,
        message: 'Processing complete',
      });

      return result;
    } catch (error) {
      onProgress?.({
        stage: 'extracting',
        progress: 0,
        message: 'Error processing file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    }
  }

  private async extractText(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<FileProcessingResult> {
    const fileType = file.type;
    const extension = this.getFileExtension(file.name);

    onProgress?.({
      stage: 'extracting',
      progress: 10,
      message: 'Extracting text from file...',
    });

    let text = '';
    let metadata: any = {};
    let pages = 1;

    try {
      if (fileType === 'application/pdf') {
        const result = await this.extractFromPDF(file, onProgress);
        text = result.text;
        metadata = result.metadata;
        pages = result.pages;
      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await this.extractFromDOCX(file, onProgress);
        text = result.text;
        metadata = result.metadata;
      } else if (fileType.startsWith('text/') || extension === 'md' || extension === 'markdown') {
        const result = await this.extractFromText(file, onProgress);
        text = result.text;
        metadata = result.metadata;
      } else if (fileType.startsWith('image/')) {
        const result = await this.extractFromImage(file, onProgress);
        text = result.text;
        metadata = result.metadata;
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      onProgress?.({
        stage: 'extracting',
        progress: 90,
        message: 'Text extraction complete',
      });

      return {
        text: this.cleanText(text),
        metadata: {
          ...metadata,
          filename: file.name,
          size: file.size,
          type: fileType,
          lastModified: new Date(file.lastModified),
        },
        pages,
        confidence: metadata.confidence || 1.0,
      };
    } catch (error) {
      throw new Error(`Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractFromPDF(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<{ text: string; metadata: any; pages: number }> {
    try {
      onProgress?.({
        stage: 'extracting',
        progress: 20,
        message: 'Reading PDF file...',
      });

      // Convert file to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      onProgress?.({
        stage: 'extracting',
        progress: 40,
        message: 'Loading PDF document...',
      });

      // Load PDF document using PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
      const pdfDocument = await loadingTask.promise;

      onProgress?.({
        stage: 'extracting',
        progress: 60,
        message: 'Extracting text from PDF pages...',
      });

      // Extract text from all pages
      let fullText = '';
      const numPages = pdfDocument.numPages;

      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Combine text items from the page
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';

        // Update progress for each page
        onProgress?.({
          stage: 'extracting',
          progress: 60 + (pageNum / numPages) * 30,
          message: `Processing page ${pageNum} of ${numPages}...`,
        });
      }

      onProgress?.({
        stage: 'extracting',
        progress: 90,
        message: 'Extracting PDF metadata...',
      });

      // Extract metadata from PDF
      const metadata: any = {
        title: '',
        author: '',
        subject: '',
        keywords: '',
        creator: '',
        producer: '',
        creationDate: '',
        modDate: '',
        pageCount: numPages,
        textLength: fullText.length,
      };

      // Try to get document info if available
      try {
        const info = await pdfDocument.getMetadata();
        if (info && info.info) {
          const pdfInfo = info.info as any;
          metadata.title = pdfInfo.Title || '';
          metadata.author = pdfInfo.Author || '';
          metadata.subject = pdfInfo.Subject || '';
          metadata.creator = pdfInfo.Creator || '';
          metadata.producer = pdfInfo.Producer || '';
          metadata.creationDate = pdfInfo.CreationDate || '';
          metadata.modDate = pdfInfo.ModDate || '';
        }
      } catch (metadataError) {
        console.warn('Could not extract PDF metadata:', metadataError);
      }

      onProgress?.({
        stage: 'extracting',
        progress: 100,
        message: 'PDF processing complete',
      });

      return {
        text: fullText,
        metadata,
        pages: numPages,
      };
    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async extractFromDOCX(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<{ text: string; metadata: any }> {
    onProgress?.({
      stage: 'extracting',
      progress: 50,
      message: 'Extracting from DOCX...',
    });

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });

    const metadata: any = {
      title: '',
      author: '',
      subject: '',
      keywords: '',
    };

    // Try to extract metadata if available
    if (result.messages.length > 0) {
      console.log('DOCX processing messages:', result.messages);
    }

    return {
      text: result.value,
      metadata,
    };
  }

  private async extractFromText(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<{ text: string; metadata: any }> {
    onProgress?.({
      stage: 'extracting',
      progress: 50,
      message: 'Reading text file...',
    });

    const text = await file.text();
    
    const metadata: any = {
      encoding: 'utf-8',
      lineCount: text.split('\n').length,
      wordCount: text.split(/\s+/).length,
    };

    return { text, metadata };
  }

  private async extractFromImage(
    file: File,
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<{ text: string; metadata: any }> {
    onProgress?.({
      stage: 'extracting',
      progress: 20,
      message: 'Initializing OCR...',
    });

    const worker = await createWorker('eng');
    
    onProgress?.({
      stage: 'extracting',
      progress: 40,
      message: 'Performing OCR...',
    });

    const { data } = await worker.recognize(file);
    
    onProgress?.({
      stage: 'extracting',
      progress: 80,
      message: 'OCR complete',
    });

    await worker.terminate();

    const metadata: any = {
      confidence: data.confidence,
      words: data.words?.length || 0,
      lines: data.lines?.length || 0,
      blocks: data.blocks?.length || 0,
    };

    return {
      text: data.text,
      metadata,
    };
  }

  private cleanText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n\s*\n\s*\n/g, '\n\n')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  async extractFromURL(url: string): Promise<FileProcessingResult> {
    try {
      // Check if we're in development or production
      const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';
      
      // Try multiple endpoints for development
      const endpoints = isDevelopment 
        ? [
            'http://localhost:8888/.netlify/functions/extract-url',
            'http://localhost:3000/.netlify/functions/extract-url',
            'http://localhost:3001/.netlify/functions/extract-url',
            'http://localhost:3002/.netlify/functions/extract-url',
          ]
        : ['/.netlify/functions/extract-url'];

      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
          });

          if (response.ok) {
            const data = await response.json();
            return data;
          } else {
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.warn(`Failed to connect to ${endpoint}:`, error);
        }
      }

      // If all endpoints failed and we're in development, try client-side extraction
      if (isDevelopment) {
        console.warn('Netlify functions not available, trying client-side extraction...');
        return await this.extractFromURLClientSide(url);
      } else {
        throw new Error(`Failed to extract from URL: ${lastError?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('URL extraction error:', error);
      throw error;
    }
  }

  private async extractFromURLClientSide(url: string): Promise<FileProcessingResult> {
    try {
      // Use a CORS proxy for development
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const response = await fetch(corsProxy + encodeURIComponent(url));
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }

      const html = await response.text();
      const text = this.extractTextFromHTML(html);
      const title = this.extractTitleFromHTML(html);
      
      const urlObj = new URL(url);
      const metadata = {
        author: urlObj.hostname,
        date: new Date().toISOString(),
        keywords: [urlObj.hostname],
        summary: title || urlObj.hostname,
        language: 'en',
        confidence: 0.8, // Lower confidence for client-side extraction
      };

      return {
        text: this.cleanText(text),
        metadata,
        confidence: 0.8,
      };
    } catch (error) {
      throw new Error(`Client-side extraction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private extractTextFromHTML(html: string): string {
    // Simple HTML to text conversion
    // In production, you might want to use a more sophisticated library
    return html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ')
      .trim();
  }

  private extractTitleFromHTML(html: string): string {
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }
}

export const fileProcessor = FileProcessor.getInstance();
