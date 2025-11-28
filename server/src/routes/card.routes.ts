import { Router } from 'express';
import {
  createCard,
  getCard,
  updateCard,
  deleteCard,
  moveCard,
} from '../controllers/card.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateCard } from '../middleware/validation.middleware';

const router = Router();

router.post('/', authenticate, validateCard, createCard);
router.get('/:id', authenticate, getCard);
router.put('/:id', authenticate, validateCard, updateCard);
router.delete('/:id', authenticate, deleteCard);
router.put('/move', authenticate, moveCard);

export default router;
