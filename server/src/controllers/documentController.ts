import type { NextFunction, Request, Response } from 'express';
import { createDocument, getDocument, listDocuments, saveDocument } from '../services/documentStore';

export async function listDocumentsHandler(_request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const documents = await listDocuments();
    response.json({ documents });
  } catch (error) {
    next(error);
  }
}

export async function createDocumentHandler(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const document = await createDocument({
      title: typeof request.body?.title === 'string' ? request.body.title : undefined,
      content: request.body?.content
    });

    response.status(201).json({ document });
  } catch (error) {
    next(error);
  }
}

export async function getDocumentHandler(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const documentId = String(request.params.id);
    const document = await getDocument(documentId);

    if (!document) {
      response.status(404).json({ message: 'Document not found' });
      return;
    }

    response.json({ document });
  } catch (error) {
    next(error);
  }
}

export async function updateDocumentHandler(request: Request, response: Response, next: NextFunction): Promise<void> {
  try {
    const documentId = String(request.params.id);
    const document = await saveDocument(documentId, {
      title: typeof request.body?.title === 'string' ? request.body.title : undefined,
      content: request.body?.content
    });

    response.json({ document });
  } catch (error) {
    next(error);
  }
}