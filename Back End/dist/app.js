"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env" });
const express_1 = __importDefault(require("express"));
const conversation_routes_js_1 = __importDefault(require("./src/routes/conversation.routes.js"));
const messages_routes_js_1 = __importDefault(require("./src/routes/messages.routes.js"));
const users_routes_js_1 = __importDefault(require("./src/routes/users.routes.js"));
const auth_routes_js_1 = __importDefault(require("./src/routes/auth.routes.js"));
const requests_route_js_1 = __importDefault(require("./src/routes/requests.route.js"));
const highlights_routes_js_1 = __importDefault(require("./src/routes/highlights.routes.js"));
const auth_middleware_js_1 = require("./src/middlewares/auth.middleware.js");
const friends_routes_js_1 = __importDefault(require("./src/routes/friends.routes.js"));
const db_conn_js_1 = __importDefault(require("./database/db.conn.js")); // ← Add this import
const http_1 = __importDefault(require("http"));
const socket_js_1 = require("./src/socket/socket.js");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
(0, socket_js_1.initializeSocket)(server);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Base URL
const baseURL = '/api/v1';
// CORS configuration
const allowedOrigins = ['http://localhost:5173', 'http://192.168.38:5173'];
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT,PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
// Routes
app.use(`${baseURL}/conversations`, conversation_routes_js_1.default);
app.use(`${baseURL}/messages`, messages_routes_js_1.default);
app.use(`${baseURL}/users`, users_routes_js_1.default);
app.use(`${baseURL}/auth`, auth_routes_js_1.default);
app.use(`${baseURL}/requests`, auth_middleware_js_1.authMiddleware, requests_route_js_1.default);
app.use(`${baseURL}/friends`, auth_middleware_js_1.authMiddleware, friends_routes_js_1.default);
app.use(`${baseURL}/highlights`, auth_middleware_js_1.authMiddleware, highlights_routes_js_1.default);
// Health check endpoint
app.get('/health', async (req, res) => {
    const health = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        services: {
            server: 'running',
            database: 'unknown'
        }
    };
    try {
        await db_conn_js_1.default.query('SELECT 1');
        health.services.database = 'connected';
    }
    catch (error) {
        health.services.database = 'disconnected';
        health.status = 'degraded';
    }
    if (health.services.database !== 'connected') {
        return res.status(503).json(health);
    }
    res.status(200).json(health);
});
// Simple me endpoint
app.get(`${baseURL}/me`, auth_middleware_js_1.authMiddleware, (req, res) => {
    res.json({ msg: 'Hello', user: req.user });
});
// 404 handler - must be LAST
app.use((req, res) => {
    res.status(404).json({ message: 'Resource not found', path: req.originalUrl });
});
const PORT = 5000;
server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
exports.default = app;
