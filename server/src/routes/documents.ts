import { Router } from 'express';
import {
  createDocumentHandler,
  getDocumentHandler,
  listDocumentsHandler,
  updateDocumentHandler
} from '../controllers/documentController';

const router = Router();

router.get('/', listDocumentsHandler);
router.post('/', createDocumentHandler);
router.get('/:id', getDocumentHandler);
router.put('/:id', updateDocumentHandler);

export default router;