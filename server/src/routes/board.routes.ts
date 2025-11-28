import { Router } from 'express';
import {
  getBoards,
  createBoard,
  getBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/board.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validateBoard } from '../middleware/validation.middleware';

const router = Router();

router.get('/', authenticate, getBoards);
router.post('/', authenticate, validateBoard, createBoard);
router.get('/:id', authenticate, getBoard);
router.put('/:id', authenticate, validateBoard, updateBoard);
router.delete('/:id', authenticate, deleteBoard);

export default router;
