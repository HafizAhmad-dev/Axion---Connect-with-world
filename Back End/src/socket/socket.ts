import { Server as SocketServer } from "socket.io";
import type { Server as HttpServer } from "http";
import { verifyToken } from "../utils/jwtToken.hook";

export let io: SocketServer;

export const initializeSocket = (server: HttpServer) => {
  io = new SocketServer(server, {
    cors: {
      origin: ["http://localhost:5173", "http://192.168.38.xxx:5173"],
      credentials: true,
    },
  });

  // Authentication middleware
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

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);
    // Join user to their personal room
    socket.join(`user:${socket.data.userId}`);

    socket.on("join_conversations", (conversationIds: string[]) => {
      conversationIds.forEach((convId) => {
        console.log(
          `Joinding Convo typo:  conversation:${convId} socketId:${socket.id}`,
        );
        socket.join(`conversation:${convId}`);
      });
      console.log("Joining Conversationss Backend", conversationIds);
      console.log(socket.rooms);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", socket.id, reason);
    });
  });

  return io;
};
