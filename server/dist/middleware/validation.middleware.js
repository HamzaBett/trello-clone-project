"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCard = exports.validateList = exports.validateBoard = void 0;
const validateBoard = (req, res, next) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            message: 'Title is required and must be a non-empty string'
        });
    }
    if (title.trim().length > 100) {
        return res.status(400).json({
            message: 'Title cannot exceed 100 characters'
        });
    }
    req.body.title = title.trim();
    next();
};
exports.validateBoard = validateBoard;
const validateList = (req, res, next) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            message: 'Title is required and must be a non-empty string'
        });
    }
    if (title.trim().length > 100) {
        return res.status(400).json({
            message: 'Title cannot exceed 100 characters'
        });
    }
    req.body.title = title.trim();
    next();
};
exports.validateList = validateList;
const validateCard = (req, res, next) => {
    const { title } = req.body;
    if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
            message: 'Title is required and must be a non-empty string'
        });
    }
    if (title.trim().length > 255) {
        return res.status(400).json({
            message: 'Title cannot exceed 255 characters'
        });
    }
    req.body.title = title.trim();
    next();
};
exports.validateCard = validateCard;
