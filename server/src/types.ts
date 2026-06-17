export type DocumentContent = {
  type: string;
  content?: Array<Record<string, unknown>>;
};

export type DocumentSummary = {
  _id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
};

export type DocumentRecord = DocumentSummary & {
  content: DocumentContent;
};

export type DocumentPatch = {
  title?: string;
  content?: DocumentContent;
};