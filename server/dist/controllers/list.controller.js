"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveList = exports.deleteList = exports.updateList = exports.createList = void 0;
const List_model_1 = __importDefault(require("../models/List.model"));
const Board_model_1 = __importDefault(require("../models/Board.model"));
const Card_model_1 = __importDefault(require("../models/Card.model"));
const createList = async (req, res) => {
    try {
        const { title, boardId } = req.body;
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
        // Create new list
        const list = new List_model_1.default({
            title,
            boardId,
            position: await getNextPosition(boardId),
        });
        await list.save();
        // Add list to board
        board.listIds.push(list._id);
        await board.save();
        res.status(201).json(list);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createList = createList;
const updateList = async (req, res) => {
    try {
        const list = await List_model_1.default.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(list.boardId);
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
        // Update list
        Object.assign(list, req.body);
        await list.save();
        res.json(list);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateList = updateList;
const deleteList = async (req, res) => {
    try {
        const list = await List_model_1.default.findById(req.params.id);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(list.boardId);
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
        // Remove list from board
        board.listIds = board.listIds.filter(id => id.toString() !== list._id.toString());
        await board.save();
        // Delete list and all its cards
        await list.deleteOne();
        await Card_model_1.default.deleteMany({ listId: list._id });
        res.json({ message: 'List deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteList = deleteList;
const moveList = async (req, res) => {
    try {
        const { listId, newPosition } = req.body;
        // Find list
        const list = await List_model_1.default.findById(listId);
        if (!list) {
            return res.status(404).json({ message: 'List not found' });
        }
        // Find board to verify user has access
        const board = await Board_model_1.default.findById(list.boardId);
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
        // Update positions of other lists
        const lists = await List_model_1.default.find({ boardId: list.boardId }).sort('position');
        // Remove the list from its current position
        const filteredLists = lists.filter(l => l._id.toString() !== listId);
        // Insert at new position
        filteredLists.splice(newPosition, 0, list);
        // Update positions
        for (let i = 0; i < filteredLists.length; i++) {
            filteredLists[i].position = i;
            await filteredLists[i].save();
        }
        res.json({ message: 'List moved successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.moveList = moveList;
// Helper function to get next position
const getNextPosition = async (boardId) => {
    const count = await List_model_1.default.countDocuments({ boardId });
    return count;
};
