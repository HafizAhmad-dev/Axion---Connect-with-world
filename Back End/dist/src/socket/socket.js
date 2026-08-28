"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.io = void 0;
const socket_io_1 = require("socket.io");
const jwtToken_hook_1 = require("../utils/jwtToken.hook");
const initializeSocket = (server) => {
    exports.io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:5173"],
            credentials: true,
        },
    });
    // Authenticate the socket connection before allowing the client to connect
    exports.io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;
            if (!token) {
                return next(new Error("Authentication error"));
            }
            const decoded = (0, jwtToken_hook_1.verifyToken)(token);
            socket.data.userId = decoded.userId;
            next();
        }
        catch (error) {
            next(new Error("Authentication error"));
        }
    });
    // Handle a new authenticated socket connection
    exports.io.on("connection", (socket) => {
        console.log("=========================================");
        console.log("Connected:", socket.data);
        // Join the user to their personal room for user-specific events
        socket.join(`user:${socket.data.userId}`);
        // Handle joining multiple conversation rooms for receiving live messages
        socket.on("join_conversations", (conversationIds) => {
            conversationIds.forEach((convId) => {
                socket.join(`conversation:${convId}`);
            });
        });
        socket.on("set_active_conversation", (conversationId) => {
            if (conversationId) {
                socket.data.activeConversation = conversationId;
            }
            else {
                delete socket.data.activeConversation;
            }
        });
        // Handle socket disconnection
        socket.on("disconnect", (reason) => {
            console.log("Disconnected:", socket.id, reason);
        });
    });
    return exports.io;
};
exports.initializeSocket = initializeSocket;
