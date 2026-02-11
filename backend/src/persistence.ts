import { Doc, encodeStateAsUpdate, applyUpdate } from 'yjs';
import Note from './models/Note';

export class PersistenceManager {
  private static instance: PersistenceManager;
  private flushIntervals: Map<string, NodeJS.Timeout> = new Map();

  static getInstance(): PersistenceManager {
    if (!PersistenceManager.instance) {
      PersistenceManager.instance = new PersistenceManager();
    }
    return PersistenceManager.instance;
  }

  async loadDocument(noteId: string): Promise<Doc | null> {
    try {
      const note = await Note.findById(noteId);
      if (note?.yjsState) {
        const doc = new Doc();
        applyUpdate(doc, note.yjsState);
        return doc;
      }
      return new Doc(); // New document
    } catch (error) {
      console.error(`Error loading document ${noteId}:`, error);
      return null;
    }
  }

  async saveDocument(noteId: string, doc: Doc): Promise<void> {
    try {
      const update = encodeStateAsUpdate(doc);
      await Note.findByIdAndUpdate(noteId, {
        yjsState: Buffer.from(update),
        updatedAt: new Date()
      });
    } catch (error) {
      console.error(`Error saving document ${noteId}:`, error);
    }
  }

  startPeriodicFlush(noteId: string, doc: Doc, intervalMs: number = 30000): void {
    // Clear existing interval
    this.stopPeriodicFlush(noteId);

    const interval = setInterval(async () => {
      await this.saveDocument(noteId, doc);
    }, intervalMs);

    this.flushIntervals.set(noteId, interval);
  }

  stopPeriodicFlush(noteId: string): void {
    const interval = this.flushIntervals.get(noteId);
    if (interval) {
      clearInterval(interval);
      this.flushIntervals.delete(noteId);
    }
  }

  async mergeOfflineEdits(noteId: string, offlineDoc: Doc): Promise<Doc> {
    try {
      // Load current document state
      const currentDoc = await this.loadDocument(noteId);
      if (!currentDoc) {
        return offlineDoc; // No existing document, use offline edits
      }

      // Apply offline edits to current document
      const offlineUpdate = encodeStateAsUpdate(offlineDoc);
      applyUpdate(currentDoc, offlineUpdate);

      // Save merged document
      await this.saveDocument(noteId, currentDoc);

      return currentDoc;
    } catch (error) {
      console.error(`Error merging offline edits for ${noteId}:`, error);
      return offlineDoc; // Fallback to offline edits
    }
  }

  async getDocumentSnapshot(noteId: string): Promise<{ title: string; content: string } | null> {
    try {
      const doc = await this.loadDocument(noteId);
      if (!doc) return null;

      const title = doc.getText('title').toString() || 'Untitled';
      const content = doc.getText('content').toString() || '';

      return { title, content };
    } catch (error) {
      console.error(`Error getting snapshot for ${noteId}:`, error);
      return null;
    }
  }

  cleanup(): void {
    for (const interval of this.flushIntervals.values()) {
      clearInterval(interval);
    }
    this.flushIntervals.clear();
  }
}
