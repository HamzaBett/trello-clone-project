import { Request, Response } from 'express';
import Card from '../models/Card.model';
import List from '../models/List.model';
import Board from '../models/Board.model';

interface AuthRequest extends Request {
  userId?: string;
}

export const createCard = async (req: AuthRequest, res: Response) => {
  try {
    const { title, listId, boardId } = req.body;

    // Find list to verify user has access
    const list = await List.findById(listId);
    if (!list) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Find board to verify user has access
    const board = await Board.findById(boardId);
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

    // Create new card
    const card = new Card({
      title,
      listId,
      boardId,
      position: await getNextPosition(listId),
    });

    await card.save();

    // Add card to list
    list.cardIds.push(card._id);
    await list.save();

    res.status(201).json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCard = async (req: AuthRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('assignedMembers', 'username email');

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find board to verify user has access
    const board = await Board.findById(card.boardId);
    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    // Check if user has access to this board
    const hasAccess = 
      board.ownerId.toString() === req.userId ||
      board.memberIds.some(member => member.userId.toString() === req.userId);

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCard = async (req: AuthRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find board to verify user has access
    const board = await Board.findById(card.boardId);
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

    // Update card
    Object.assign(card, req.body);
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCard = async (req: AuthRequest, res: Response) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find board to verify user has access
    const board = await Board.findById(card.boardId);
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

    // Remove card from list
    await List.findByIdAndUpdate(card.listId, {
      $pull: { cardIds: card._id }
    });

    // Delete card
    await card.deleteOne();

    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const moveCard = async (req: AuthRequest, res: Response) => {
  try {
    const { cardId, newListId, newPosition } = req.body;

    // Find card
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Find source and destination lists
    const oldList = await List.findById(card.listId);
    const newList = await List.findById(newListId);

    if (!oldList || !newList) {
      return res.status(404).json({ message: 'List not found' });
    }

    // Find board to verify user has access
    const board = await Board.findById(card.boardId);
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

    // If moving within the same list
    if (card.listId.toString() === newListId) {
      await moveCardWithinList(card, newListId, newPosition);
    } else {
      // Moving between different lists
      await moveCardBetweenLists(card, oldList, newList, newPosition);
    }

    res.json({ message: 'Card moved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to move card within the same list
const moveCardWithinList = async (
  card: any,
  listId: string,
  newPosition: number
) => {
  const cards = await Card.find({ listId }).sort('position');
  const filteredCards = cards.filter(c => c._id.toString() !== card._id.toString());
  filteredCards.splice(newPosition, 0, card);

  for (let i = 0; i < filteredCards.length; i++) {
    filteredCards[i].position = i;
    await filteredCards[i].save();
  }
};

// Helper function to move card between different lists
const moveCardBetweenLists = async (
  card: any,
  oldList: any,
  newList: any,
  newPosition: number
) => {
  // Update positions in old list
  const oldListCards = await Card.find({ listId: oldList._id }).sort('position');
  const updatedOldListCards = oldListCards.filter(
    c => c._id.toString() !== card._id.toString()
  );

  for (let i = 0; i < updatedOldListCards.length; i++) {
    updatedOldListCards[i].position = i;
    await updatedOldListCards[i].save();
  }

  // Update positions in new list
  const newListCards = await Card.find({ listId: newList._id }).sort('position');
  newListCards.splice(newPosition, 0, card);

  for (let i = 0; i < newListCards.length; i++) {
    newListCards[i].position = i;
    await newListCards[i].save();
  }

  // Update card's listId
  card.listId = newList._id;
  await card.save();
};

// Helper function to get next position
const getNextPosition = async (listId: string): Promise<number> => {
  const count = await Card.countDocuments({ listId });
  return count;
};
