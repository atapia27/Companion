// Core data types for the AI Document Companion

export interface User {
  id: string;
  name: string;
  email?: string;
  createdAt: Date;
  settings: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  retrievalDefaults: RetrievalSettings;
  uiPreferences: UIPreferences;
}

export interface RetrievalSettings {
  topK: number;
  scoreThreshold: number;
  useMMR: boolean;
  chunkSize: number;
  overlapSize: number;
}

export interface UIPreferences {
  showCitations: boolean;
  autoScroll: boolean;
  compactMode: boolean;
  keyboardShortcuts: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  documentCount: number;
  isPublic: boolean;
  tags: string[];
}

export interface Document {
  id: string;
  collectionId: string;
  title: string;
  sourceType: 'file' | 'url' | 'text';
  sourceUrl?: string;
  filename?: string;
  mimeType: string;
  sha256: string;
  status: DocumentStatus;
  createdAt: Date;
  updatedAt: Date;
  metadata: DocumentMetadata;
  size: number;
  pageCount?: number;
}

export type DocumentStatus = 'processing' | 'indexed' | 'error' | 'archived';

export interface DocumentMetadata {
  author?: string;
  date?: string;
  keywords?: string[];
  summary?: string;
  language?: string;
  confidence?: number;
  // Additional properties added by file processor
  filename?: string;
  size?: number;
  type?: string;
  lastModified?: Date;
  title?: string;
  subject?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  // Custom name for better content organization
  customName?: string;
}

export interface Chunk {
  id: string;
  documentId: string;
  order: number;
  page?: number;
  heading?: string;
  text: string;
  vector: number[];
  tokenCount: number;
  metadata: ChunkMetadata;
}

export interface ChunkMetadata {
  section?: string;
  paragraph?: number;
  confidence?: number;
  language?: string;
}

export interface Exchange {
  id: string;
  collectionId: string;
  question: string;
  answer: string;
  citations: Citation[];
  createdAt: Date;
  model: string;
  tokens: {
    prompt: number;
    completion: number;
    total: number;
  };
  metadata: ExchangeMetadata;
}

export interface Citation {
  id: string;
  chunkId: string;
  documentId: string;
  text: string;
  score: number;
  page?: number;
  location: {
    start: number;
    end: number;
  };
}

export interface ExchangeMetadata {
  retrievalTime: number;
  processingTime: number;
  sourcesUsed: number;
  confidence: number;
}

export interface Briefing {
  id: string;
  collectionId: string;
  title: string;
  sections: BriefingSection[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  metadata: BriefingMetadata;
}

export interface BriefingSection {
  id: string;
  type: 'overview' | 'key-insights' | 'risks' | 'action-items' | 'sources' | 'custom';
  title: string;
  content: string;
  citations: Citation[];
  order: number;
}

export interface BriefingMetadata {
  generatedFrom: string[];
  model: string;
  totalTokens: number;
  generationTime: number;
}

// AI and API types
export interface AIRequest {
  question: string;
  context: ContextPassage[];
  collectionId: string;
  model: 'gemini-2.0-flash-exp' | 'gpt-oss-20b' | 'mock-api';
  settings: RetrievalSettings;
}

export interface ContextPassage {
  id: string;
  text: string;
  source: {
    documentId: string;
    documentTitle: string;
    chunkId: string;
    page?: number;
  };
  score: number;
}

export interface AIResponse {
  answer: string;
  citations: Citation[];
  followUpQuestions: string[];
  metadata: {
    model: string;
    tokens: number;
    processingTime: number;
  };
}

// File processing types
export interface FileProcessingResult {
  text: string;
  metadata: DocumentMetadata;
  pages?: number;
  confidence?: number;
}

export interface ProcessingProgress {
  stage: 'uploading' | 'extracting' | 'chunking' | 'embedding' | 'indexing' | 'complete';
  progress: number;
  message: string;
  error?: string;
}

// UI and component types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
}

export interface ModalState {
  isOpen: boolean;
  type: 'create-collection' | 'import-documents' | 'settings' | 'export-briefing' | null;
  data?: any;
}

// Search and filter types
export interface SearchFilters {
  collections: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  documentTypes: string[];
  tags: string[];
}

export interface SearchResult {
  chunks: Chunk[];
  documents: Document[];
  exchanges: Exchange[];
  briefings: Briefing[];
  totalResults: number;
}

// Export types
export interface ExportOptions {
  format: 'pdf' | 'markdown' | 'json';
  includeCitations: boolean;
  includeMetadata: boolean;
  sections: string[];
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface PaginationParams {
  page: number;
  limit: number;
  total: number;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}
