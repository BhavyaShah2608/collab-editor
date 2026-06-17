import { nanoid } from 'nanoid';
import { DocumentModel } from '../models/Document.js';
import { hasMongoConnection } from '../config/db.js';
import type { DocumentPatch, DocumentRecord, DocumentSummary } from '../types.js';

const defaultContent = { type: 'doc', content: [{ type: 'paragraph' }] };
const memoryStore = new Map<string, DocumentRecord>();

function normalizeTitle(title?: string): string {
  const trimmed = title?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : 'Untitled Document';
}

function normalizeContent(content?: DocumentPatch['content']): DocumentRecord['content'] {
  return content ?? defaultContent;
}

function mapMongoDocument(document: {
  _id: string;
  title: string;
  content: DocumentRecord['content'];
  createdAt: Date;
  updatedAt: Date;
}): DocumentRecord {
  return {
    _id: String(document._id),
    title: document.title,
    content: document.content,
    createdAt: new Date(document.createdAt),
    updatedAt: new Date(document.updatedAt)
  };
}

export async function listDocuments(): Promise<DocumentSummary[]> {
  if (hasMongoConnection()) {
    const documents = await DocumentModel.find().sort({ updatedAt: -1 }).lean();
    return documents.map((document: any) => ({
      _id: String(document._id),
      title: document.title,
      createdAt: new Date(document.createdAt),
      updatedAt: new Date(document.updatedAt)
    }));
  }

  return Array.from(memoryStore.values())
    .sort((left, right) => right.updatedAt.getTime() - left.updatedAt.getTime())
    .map(({ _id, title, createdAt, updatedAt }) => ({ _id, title, createdAt, updatedAt }));
}

export async function getDocument(documentId: string): Promise<DocumentRecord | null> {
  if (hasMongoConnection()) {
    const document = await DocumentModel.findById(documentId).lean();
    return document
      ? mapMongoDocument({
          _id: String(document._id),
          title: document.title,
          content: document.content as DocumentRecord['content'],
          createdAt: document.createdAt,
          updatedAt: document.updatedAt
        })
      : null;
  }

  return memoryStore.get(documentId) ?? null;
}

export async function createDocument(initialValues: DocumentPatch = {}): Promise<DocumentRecord> {
  const document: DocumentRecord = {
    _id: nanoid(10),
    title: normalizeTitle(initialValues.title),
    content: normalizeContent(initialValues.content),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  if (hasMongoConnection()) {
    const created = await DocumentModel.create(document);
    return mapMongoDocument(created.toObject() as DocumentRecord);
  }

  memoryStore.set(document._id, document);
  return document;
}

export async function saveDocument(documentId: string, patch: DocumentPatch): Promise<DocumentRecord> {
  const existingDocument = await getDocument(documentId);
  const nextDocument: DocumentRecord = {
    _id: documentId,
    title: normalizeTitle(patch.title ?? existingDocument?.title),
    content: normalizeContent(patch.content ?? existingDocument?.content),
    createdAt: existingDocument?.createdAt ?? new Date(),
    updatedAt: new Date()
  };

  if (hasMongoConnection()) {
    const savedDocument = await DocumentModel.findByIdAndUpdate(
      documentId,
      {
        _id: documentId,
        title: nextDocument.title,
        content: nextDocument.content,
        updatedAt: nextDocument.updatedAt,
        createdAt: nextDocument.createdAt
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    if (!savedDocument) {
      throw new Error('Unable to save document.');
    }

    return mapMongoDocument({
      _id: String(savedDocument._id),
      title: savedDocument.title,
      content: savedDocument.content as DocumentRecord['content'],
      createdAt: savedDocument.createdAt,
      updatedAt: savedDocument.updatedAt
    });
  }

  memoryStore.set(documentId, nextDocument);
  return nextDocument;
}