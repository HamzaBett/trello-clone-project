"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_model_1 = __importDefault(require("../models/User.model"));
const jwt_util_1 = require("../utils/jwt.util");
const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        // Check if user already exists
        const existingUser = await User_model_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Create new user
        const user = new User_model_1.default({
            email,
            password: hashedPassword,
            username,
        });
        await user.save();
        // Generate token
        const token = (0, jwt_util_1.generateToken)(user._id.toString());
        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = await User_model_1.default.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Check password
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // Generate token
        const token = (0, jwt_util_1.generateToken)(user._id.toString());
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const user = await User_model_1.default.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
