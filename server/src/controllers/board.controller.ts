import { Request, Response } from 'express';
import Board from '../models/Board.model';
import User from '../models/User.model';

interface AuthRequest extends Request {
  userId?: string;
}

export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const boards = await Board.find({
      $or: [
        { ownerId: req.userId },
        { 'memberIds.userId': req.userId }
      ]
    }).populate('ownerId', 'username email');

    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, background } = req.body;

    // Create new board
    const board = new Board({
      title,
      description,
      background,
      ownerId: req.userId,
      memberIds: [{ userId: req.userId, role: 'owner' }],
    });

    await board.save();

    // Add board to user's boardIds
    await User.findByIdAndUpdate(req.userId, {
      $push: { boardIds: board._id }
    });

    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getBoard = async (req: AuthRequest, res: Response) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('ownerId', 'username email')
      .populate('memberIds.userId', 'username email');

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user has access to this board
    const hasAccess = 
      board.ownerId.toString() === req.userId ||
      board.memberIds.some(member => member.userId._id.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update lastViewedAt
    board.lastViewedAt = new Date();
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateBoard = async (req: AuthRequest, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user has edit permissions
    const isOwner = board.ownerId.toString() === req.userId;
    const member = board.memberIds.find(m => m.userId.toString() === req.userId);
    const hasEditPermission = isOwner || (member && member.role !== 'viewer');

    if (!hasEditPermission) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update board
    Object.assign(board, req.body);
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteBoard = async (req: AuthRequest, res: Response) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Only owner can delete board
    if (board.ownerId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

await board.deleteOne();

    // Remove board from users' boardIds
    await User.updateMany(
      { boardIds: req.params.id },
      { $pull: { boardIds: req.params.id } }
    );

    res.json({ message: 'Board deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
