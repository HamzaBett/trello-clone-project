import { Router } from 'express';
import {
  createList,
  updateList,
  deleteList,
  moveList,
} from '../controllers/list.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateList } from '../middleware/validation.middleware';

const router = Router();

router.post('/', authenticate, validateList, createList);
router.put('/:id', authenticate, validateList, updateList);
router.delete('/:id', authenticate, deleteList);
router.put('/move', authenticate, moveList);

export default router;
