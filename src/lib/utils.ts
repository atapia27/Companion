import { v4 as uuidv4 } from 'uuid';
import { sha256 } from 'js-sha256';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Chunk, Document, Collection, RetrievalSettings } from '@/types';

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Text processing utilities
export function chunkText(
  text: string,
  chunkSize: number = 4000,
  overlapSize: number = 200
): string[] {
  const chunks: string[] = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length);
    let chunk = text.slice(start, end);

    // Try to break at sentence boundaries
    if (end < text.length) {
      const lastSentence = chunk.lastIndexOf('. ');
      const lastParagraph = chunk.lastIndexOf('\n\n');
      const breakPoint = Math.max(lastSentence, lastParagraph);

      if (breakPoint > start + chunkSize * 0.7) {
        chunk = chunk.slice(0, breakPoint + 1);
      }
    }

    chunks.push(chunk.trim());
    start = end - overlapSize;
  }

  return chunks.filter(chunk => chunk.length > 0);
}

export function extractHeadings(text: string): string[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: string[] = [];
  let match;

  while ((match = headingRegex.exec(text)) !== null) {
    headings.push(match[2].trim());
  }

  return headings;
}

export function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
}

// Token counting (simple approximation)
export function countTokens(text: string): number {
  // Rough approximation: 1 token ≈ 4 characters for English text
  return Math.ceil(text.length / 4);
}

// Hash utilities
export async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(buffer);
  return sha256(uint8Array);
}

export function calculateTextHash(text: string): string {
  return sha256(text);
}

// ID generation
export function generateId(): string {
  return uuidv4();
}

// Date utilities
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
}

// File utilities
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function isSupportedFileType(file: File): boolean {
  const supportedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'text/markdown',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ];
  
  return supportedTypes.includes(file.type);
}

// URL utilities
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

// Vector utilities
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have the same length');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Simple text embedding (placeholder - replace with actual embedding model)
export async function generateEmbedding(text: string): Promise<number[]> {
  // This is a placeholder implementation
  // In production, you would use a proper embedding model
  const words = text.toLowerCase().split(/\s+/);
  const embedding = new Array(384).fill(0);
  
  words.forEach((word, index) => {
    const hash = word.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    embedding[index % 384] += hash / 1000;
  });
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
  return embedding.map(val => val / magnitude);
}

// Search utilities
export function searchChunks(
  chunks: Chunk[],
  query: string,
  topK: number = 16,
  threshold: number = 0.1
): Promise<Chunk[]> {
  return new Promise(async (resolve) => {
    const queryEmbedding = await generateEmbedding(query);
    const scoredChunks = chunks.map(chunk => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.vector),
    }));

    const filteredChunks = scoredChunks
      .filter(chunk => chunk.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    resolve(filteredChunks);
  });
}

// Default settings
export const defaultRetrievalSettings: RetrievalSettings = {
  topK: 16,
  scoreThreshold: 0.1,
  useMMR: false,
  chunkSize: 4000,
  overlapSize: 200,
};

// Validation utilities
export function validateCollection(collection: Partial<Collection>): string[] {
  const errors: string[] = [];
  
  if (!collection.name?.trim()) {
    errors.push('Collection name is required');
  }
  
  if (collection.name && collection.name.length > 100) {
    errors.push('Collection name must be less than 100 characters');
  }
  
  return errors;
}

export function validateDocument(document: Partial<Document>): string[] {
  const errors: string[] = [];
  
  if (!document.title?.trim()) {
    errors.push('Document title is required');
  }
  
  if (!document.collectionId) {
    errors.push('Collection ID is required');
  }
  
  return errors;
}

// Error handling
export function createError(code: string, message: string, details?: any) {
  return {
    code,
    message,
    details,
    timestamp: new Date(),
  };
}

// Performance utilities
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Local storage utilities
export function saveToLocalStorage(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

// AI Model utilities
export function getPreferredAIModel(): 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api' {
  try {
    const savedModel = localStorage.getItem('ai-model-preference');
    if (savedModel === 'gemini-2.0-flash-exp' || savedModel === 'gpt-oss-20b' || savedModel === 'mock-api') {
      return savedModel as 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api';
    }
  } catch (error) {
    console.warn('Failed to load AI model preference:', error);
  }
  return 'gpt-oss-20b'; // Default to GPT-OSS-20B
}

// Color utilities
export function generateColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

// Text utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function extractFirstSentence(text: string): string {
  const match = text.match(/[^.!?]+[.!?]+/);
  return match ? match[0].trim() : text.slice(0, 100) + '...';
}
