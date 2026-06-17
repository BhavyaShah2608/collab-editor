import axios from 'axios';
import type { DocumentRecord } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
});

export async function fetchDocuments() {
  const response = await api.get<{ documents: DocumentRecord[] }>('/documents');
  return response.data.documents;
}

export async function createDocument() {
  const response = await api.post<{ document: DocumentRecord }>('/documents');
  return response.data.document;
}

export async function fetchDocument(documentId: string) {
  const response = await api.get<{ document: DocumentRecord }>(`/documents/${documentId}`);
  return response.data.document;
}

export async function updateDocument(documentId: string, payload: Partial<DocumentRecord>) {
  const response = await api.put<{ document: DocumentRecord }>(`/documents/${documentId}`, payload);
  return response.data.document;
}