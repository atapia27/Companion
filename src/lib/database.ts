import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  Collection,
  Document,
  Chunk,
  Exchange,
  Briefing,
  User,
  UserSettings,
} from '@/types';

interface CompanionDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  collections: {
    key: string;
    value: Collection;
    indexes: {
      'by-created': Date;
      'by-updated': Date;
    };
  };
  documents: {
    key: string;
    value: Document;
    indexes: {
      'by-collection': string;
      'by-status': string;
      'by-created': Date;
      'by-sha256': string;
    };
  };
  chunks: {
    key: string;
    value: Chunk;
    indexes: {
      'by-document': string;
      'by-collection': string;
      'by-order': number;
    };
  };
  exchanges: {
    key: string;
    value: Exchange;
    indexes: {
      'by-collection': string;
      'by-created': Date;
    };
  };
  briefings: {
    key: string;
    value: Briefing;
    indexes: {
      'by-collection': string;
      'by-created': Date;
    };
  };
  settings: {
    key: string;
    value: UserSettings;
  };
}

class DatabaseManager {
  private db: IDBPDatabase<CompanionDB> | null = null;
  private readonly DB_NAME = 'companion-db';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    this.db = await openDB<CompanionDB>(this.DB_NAME, this.DB_VERSION, {
      upgrade(db) {
        // Users store
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users');
        }

        // Collections store
        if (!db.objectStoreNames.contains('collections')) {
          const collectionsStore = db.createObjectStore('collections', { keyPath: 'id' });
          collectionsStore.createIndex('by-created', 'createdAt');
          collectionsStore.createIndex('by-updated', 'updatedAt');
        }

        // Documents store
        if (!db.objectStoreNames.contains('documents')) {
          const documentsStore = db.createObjectStore('documents', { keyPath: 'id' });
          documentsStore.createIndex('by-collection', 'collectionId');
          documentsStore.createIndex('by-status', 'status');
          documentsStore.createIndex('by-created', 'createdAt');
          documentsStore.createIndex('by-sha256', 'sha256');
        }

        // Chunks store
        if (!db.objectStoreNames.contains('chunks')) {
          const chunksStore = db.createObjectStore('chunks', { keyPath: 'id' });
          chunksStore.createIndex('by-document', 'documentId');
          chunksStore.createIndex('by-collection', 'collectionId');
          chunksStore.createIndex('by-order', 'order');
        }

        // Exchanges store
        if (!db.objectStoreNames.contains('exchanges')) {
          const exchangesStore = db.createObjectStore('exchanges', { keyPath: 'id' });
          exchangesStore.createIndex('by-collection', 'collectionId');
          exchangesStore.createIndex('by-created', 'createdAt');
        }

        // Briefings store
        if (!db.objectStoreNames.contains('briefings')) {
          const briefingsStore = db.createObjectStore('briefings', { keyPath: 'id' });
          briefingsStore.createIndex('by-collection', 'collectionId');
          briefingsStore.createIndex('by-created', 'createdAt');
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }

  private async ensureDB(): Promise<IDBPDatabase<CompanionDB>> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const db = await this.ensureDB();
    return db.get('users', id);
  }

  async saveUser(user: User): Promise<void> {
    const db = await this.ensureDB();
    await db.put('users', user);
  }

  // Collection operations
  async getCollections(): Promise<Collection[]> {
    const db = await this.ensureDB();
    return db.getAll('collections');
  }

  async getCollection(id: string): Promise<Collection | undefined> {
    const db = await this.ensureDB();
    return db.get('collections', id);
  }

  async saveCollection(collection: Collection): Promise<void> {
    const db = await this.ensureDB();
    await db.put('collections', collection);
  }

  async deleteCollection(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete('collections', id);
  }

  // Document operations
  async getDocuments(collectionId?: string): Promise<Document[]> {
    const db = await this.ensureDB();
    if (collectionId) {
      return db.getAllFromIndex('documents', 'by-collection', collectionId);
    }
    return db.getAll('documents');
  }

  async getDocument(id: string): Promise<Document | undefined> {
    const db = await this.ensureDB();
    return db.get('documents', id);
  }

  async saveDocument(document: Document): Promise<void> {
    const db = await this.ensureDB();
    await db.put('documents', document);
  }

  async deleteDocument(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete('documents', id);
  }

  async getDocumentsByHash(sha256: string): Promise<Document[]> {
    const db = await this.ensureDB();
    return db.getAllFromIndex('documents', 'by-sha256', sha256);
  }

  // Chunk operations
  async getChunks(documentId?: string, collectionId?: string): Promise<Chunk[]> {
    const db = await this.ensureDB();
    if (documentId) {
      return db.getAllFromIndex('chunks', 'by-document', documentId);
    }
    if (collectionId) {
      return db.getAllFromIndex('chunks', 'by-collection', collectionId);
    }
    return db.getAll('chunks');
  }

  async saveChunk(chunk: Chunk): Promise<void> {
    const db = await this.ensureDB();
    await db.put('chunks', chunk);
  }

  async saveChunks(chunks: Chunk[]): Promise<void> {
    const db = await this.ensureDB();
    const tx = db.transaction('chunks', 'readwrite');
    await Promise.all(chunks.map(chunk => tx.store.put(chunk)));
    await tx.done;
  }

  async deleteChunks(documentId: string): Promise<void> {
    const db = await this.ensureDB();
    const chunks = await db.getAllFromIndex('chunks', 'by-document', documentId);
    const tx = db.transaction('chunks', 'readwrite');
    await Promise.all(chunks.map(chunk => tx.store.delete(chunk.id)));
    await tx.done;
  }

  // Exchange operations
  async getExchanges(collectionId?: string): Promise<Exchange[]> {
    const db = await this.ensureDB();
    if (collectionId) {
      return db.getAllFromIndex('exchanges', 'by-collection', collectionId);
    }
    return db.getAll('exchanges');
  }

  async saveExchange(exchange: Exchange): Promise<void> {
    const db = await this.ensureDB();
    await db.put('exchanges', exchange);
  }

  // Briefing operations
  async getBriefings(collectionId?: string): Promise<Briefing[]> {
    const db = await this.ensureDB();
    if (collectionId) {
      return db.getAllFromIndex('briefings', 'by-collection', collectionId);
    }
    return db.getAll('briefings');
  }

  async getBriefing(id: string): Promise<Briefing | undefined> {
    const db = await this.ensureDB();
    return db.get('briefings', id);
  }

  async saveBriefing(briefing: Briefing): Promise<void> {
    const db = await this.ensureDB();
    await db.put('briefings', briefing);
  }

  async deleteBriefing(id: string): Promise<void> {
    const db = await this.ensureDB();
    await db.delete('briefings', id);
  }

  // Settings operations
  async getSettings(): Promise<UserSettings | undefined> {
    const db = await this.ensureDB();
    return db.get('settings', 'default');
  }

  async saveSettings(settings: UserSettings): Promise<void> {
    const db = await this.ensureDB();
    await db.put('settings', settings, 'default');
  }

  // Utility operations
  async clearAll(): Promise<void> {
    const db = await this.ensureDB();
    await db.clear('collections');
    await db.clear('documents');
    await db.clear('chunks');
    await db.clear('exchanges');
    await db.clear('briefings');
  }

  async getStats(): Promise<{
    collections: number;
    documents: number;
    chunks: number;
    exchanges: number;
    briefings: number;
  }> {
    const db = await this.ensureDB();
    const [collections, documents, chunks, exchanges, briefings] = await Promise.all([
      db.count('collections'),
      db.count('documents'),
      db.count('chunks'),
      db.count('exchanges'),
      db.count('briefings'),
    ]);

    return {
      collections,
      documents,
      chunks,
      exchanges,
      briefings,
    };
  }
}

// Export singleton instance
export const db = new DatabaseManager();
