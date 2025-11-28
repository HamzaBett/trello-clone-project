"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveCard = exports.deleteCard = exports.updateCard = exports.getCard = exports.createCard = void 0;
const Card_model_1 = __importDefault(require("../models/Card.model"));
const List_model_1 = __importDefault(require("../models/List.model"));
const Board_model_1 = __importDefault(require("../models/Board.model"));
const createCard = async (req, res) => {
    try {
        const { title, listId, boardId } = req.body;
        // Find list to verify user has access
        const list = await List_model_1.default.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(boardId);
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
        const card = new Card_model_1.default({
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCard = createCard;
const getCard = async (req, res) => {
    try {
        const card = await Card_model_1.default.findById(req.params.id)
            .populate('assignedMembers', 'username email');
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(card.boardId);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Check if user has access to this board
        const hasAccess = board.ownerId.toString() === req.userId ||
            board.memberIds.some(member => member.userId.toString() === req.userId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }
        res.json(card);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCard = getCard;
const updateCard = async (req, res) => {
    try {
        const card = await Card_model_1.default.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(card.boardId);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateCard = updateCard;
const deleteCard = async (req, res) => {
    try {
        const card = await Card_model_1.default.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(card.boardId);
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
        await List_model_1.default.findByIdAndUpdate(card.listId, {
            $pull: { cardIds: card._id }
        });
        // Delete card
        await card.deleteOne();
        res.json({ message: 'Card deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteCard = deleteCard;
const moveCard = async (req, res) => {
    try {
        const { cardId, newListId, newPosition } = req.body;
        // Find card
        const card = await Card_model_1.default.findById(cardId);
        if (!card) {
            return res.status(404).json({ message: 'Card not found' });
        }
        // Find source and destination lists
        const oldList = await List_model_1.default.findById(card.listId);
        const newList = await List_model_1.default.findById(newListId);
        if (!oldList || !newList) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(card.boardId);
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
        }
        else {
            // Moving between different lists
            await moveCardBetweenLists(card, oldList, newList, newPosition);
        }
        res.json({ message: 'Card moved successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.moveCard = moveCard;
// Helper function to move card within the same list
const moveCardWithinList = async (card, listId, newPosition) => {
    const cards = await Card_model_1.default.find({ listId }).sort('position');
    const filteredCards = cards.filter(c => c._id.toString() !== card._id.toString());
    filteredCards.splice(newPosition, 0, card);
    for (let i = 0; i < filteredCards.length; i++) {
        filteredCards[i].position = i;
        await filteredCards[i].save();
    }
};
// Helper function to move card between different lists
const moveCardBetweenLists = async (card, oldList, newList, newPosition) => {
    // Update positions in old list
    const oldListCards = await Card_model_1.default.find({ listId: oldList._id }).sort('position');
    const updatedOldListCards = oldListCards.filter(c => c._id.toString() !== card._id.toString());
    for (let i = 0; i < updatedOldListCards.length; i++) {
        updatedOldListCards[i].position = i;
        await updatedOldListCards[i].save();
    }
    // Update positions in new list
    const newListCards = await Card_model_1.default.find({ listId: newList._id }).sort('position');
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
const getNextPosition = async (listId) => {
    const count = await Card_model_1.default.countDocuments({ listId });
    return count;
};
