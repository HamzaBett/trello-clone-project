"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = require("express-rate-limit");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const board_routes_1 = __importDefault(require("./routes/board.routes"));
const list_routes_1 = __importDefault(require("./routes/list.routes"));
const card_routes_1 = __importDefault(require("./routes/card.routes"));
const database_1 = __importDefault(require("./config/database"));
const socket_server_1 = __importDefault(require("./socket/socket.server"));
// Load environment variables
dotenv_1.default.config();
// Connect to database
(0, database_1.default)();
// Create Express app
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
// Rate limiting
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
// API routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/boards', board_routes_1.default);
app.use('/api/lists', list_routes_1.default);
app.use('/api/cards', card_routes_1.default);
// Socket.IO
socket_server_1.default.init(server);
// Error handling middleware
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});
// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
