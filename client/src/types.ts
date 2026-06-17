export type DocumentContent = {
  type: string;
  content?: Array<{
    type: string;
    attrs?: Record<string, string>;
    content?: Array<{ type: string; text?: string; marks?: Array<{ type: string }> }>;
    text?: string;
    marks?: Array<{ type: string }>;
  }>;
};

export type DocumentRecord = {
  _id: string;
  title: string;
  content: DocumentContent;
  createdAt: string;
  updatedAt: string;
};