// hooks/useSocket.ts

import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { getSocket } from "../socket/socket";

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    let singletonSocket: Socket;

    try {
      singletonSocket = getSocket();
    } catch (error) {
      console.error(error);
      return;
    }

    setSocket(singletonSocket);
    setIsConnected(singletonSocket.connected);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket disconnected");
      setIsConnected(false);
    };

    singletonSocket.on("connect", handleConnect);
    singletonSocket.on("disconnect", handleDisconnect);

    return () => {
      singletonSocket.off("connect", handleConnect);
      singletonSocket.off("disconnect", handleDisconnect);
    };
  }, []);

  return {
    socket,
    isConnected,
  };
};