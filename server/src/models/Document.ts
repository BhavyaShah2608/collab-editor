import mongoose, { type Model } from 'mongoose';
import type { DocumentRecord } from '../types.js';

type DocumentSchemaType = DocumentRecord;

const { Schema, model, models } = mongoose;

const documentSchema = new Schema<DocumentSchemaType>(
  {
    _id: { type: String, required: true },
    title: { type: String, required: true, default: 'Untitled Document' },
    content: {
      type: Schema.Types.Mixed,
      required: true,
      default: { type: 'doc', content: [{ type: 'paragraph' }] }
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export const DocumentModel: Model<DocumentSchemaType> = (models.Document as Model<DocumentSchemaType>) ?? model<DocumentSchemaType>('Document', documentSchema);