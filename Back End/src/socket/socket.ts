import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "../utils/jwtToken.hook";

export let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:5173"],
      credentials: true,
    },
  });

  // Authenticate the socket connection before allowing the client to connect
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = verifyToken(token) as { userId: string };

      socket.data.userId = decoded.userId;

      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Handle a new authenticated socket connection
  io.on("connection", (socket) => {
    console.log("=========================================");
    console.log("Connected:", socket.data);

    // Join the user to their personal room for user-specific events
    socket.join(`user:${socket.data.userId}`);

    // Handle joining multiple conversation rooms for receiving live messages
    socket.on("join_conversations", (conversationIds: string[]) => {
      conversationIds.forEach((convId) => {
       
        socket.join(`conversation:${convId}`);
      });
    });

    socket.on("set_active_conversation", (conversationId: string | null) => {
      if(conversationId){
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

  return io;
};
