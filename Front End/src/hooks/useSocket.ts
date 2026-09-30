// hooks/useSocket.ts

import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { selectUser } from "../Store/Slices/UserSlice";
import { getSocket } from "../socket/socket";
import { useSelector } from "react-redux";

export const useSocket = () => {
  const user = useSelector(selectUser);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const singletonSocket = getSocket();

    if (!singletonSocket) {
      setSocket(null);
      setIsConnected(false);
      return;
    }

    setSocket(singletonSocket);
    setIsConnected(singletonSocket.connected);

    const handleConnect = () => {
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleConnectError = (error: Error) => {
      console.error("Socket connection error:", error.message);
      setIsConnected(false);
    };

    singletonSocket.on("connect", handleConnect);
    singletonSocket.on("disconnect", handleDisconnect);
    singletonSocket.on("connect_error", handleConnectError);

    return () => {
      singletonSocket.off("connect", handleConnect);
      singletonSocket.off("disconnect", handleDisconnect);
      singletonSocket.off("connect_error", handleConnectError);
    };
  }, [user]);

  return {
    socket,
    isConnected,
  };
};