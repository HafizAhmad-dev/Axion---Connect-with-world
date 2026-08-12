// src/socket/socket.ts

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (socket) {
    return socket;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("No authentication token found.");
  }

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};