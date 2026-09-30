// src/socket/socket.ts

import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  // Return existing singleton
  if (socket) {
    return socket;
  }

  // Get authentication token
  const token = localStorage.getItem("token");

  // User is not authenticated yet
  if (!token) {
    return null;

  }

  // Create socket
  socket = io(SOCKET_URL, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });


  return socket;
};

export const disconnectSocket = (): void => {
  if (!socket) {
    return;
  }

  socket.disconnect();
  socket = null;
};