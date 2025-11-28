"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoard = exports.updateBoard = exports.getBoard = exports.createBoard = exports.getBoards = void 0;
const Board_model_1 = __importDefault(require("../models/Board.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
const getBoards = async (req, res) => {
    try {
        const boards = await Board_model_1.default.find({
            $or: [
                { ownerId: req.userId },
                { 'memberIds.userId': req.userId }
            ]
        }).populate('ownerId', 'username email');
        res.json(boards);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getBoards = getBoards;
const createBoard = async (req, res) => {
    try {
        const { title, description, background } = req.body;
        // Create new board
        const board = new Board_model_1.default({
            title,
            description,
            background,
            ownerId: req.userId,
            memberIds: [{ userId: req.userId, role: 'owner' }],
        });
        await board.save();
        // Add board to user's boardIds
        await User_model_1.default.findByIdAndUpdate(req.userId, {
            $push: { boardIds: board._id }
        });
        res.status(201).json(board);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createBoard = createBoard;
const getBoard = async (req, res) => {
    try {
        const board = await Board_model_1.default.findById(req.params.id)
            .populate('ownerId', 'username email')
            .populate('memberIds.userId', 'username email');
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Check if user has access to this board
        const hasAccess = board.ownerId.toString() === req.userId ||
            board.memberIds.some(member => member.userId._id.toString() === req.userId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied' });
        }
        // Update lastViewedAt
        board.lastViewedAt = new Date();
        await board.save();
        res.json(board);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getBoard = getBoard;
const updateBoard = async (req, res) => {
    try {
        const board = await Board_model_1.default.findById(req.params.id);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateBoard = updateBoard;
const deleteBoard = async (req, res) => {
    try {
        const board = await Board_model_1.default.findById(req.params.id);
        if (!board) {
            return res.status(404).json({ message: 'Board not found' });
        }
        // Only owner can delete board
        if (board.ownerId.toString() !== req.userId) {
            return res.status(403).json({ message: 'Access denied' });
        }
        await board.deleteOne();
        // Remove board from users' boardIds
        await User_model_1.default.updateMany({ boardIds: req.params.id }, { $pull: { boardIds: req.params.id } });
        res.json({ message: 'Board deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteBoard = deleteBoard;
