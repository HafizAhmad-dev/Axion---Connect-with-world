import { useCallback } from "react";
import { useSocket } from "./useSocket";
import { JoinConverstionsRooms } from "../services/socketEmittersService";

export const useSocketEmitters = () => {
  const { socket, isConnected } = useSocket();

  const joinRooms = useCallback(
    (conversationIds: string[]) => {
      if (!socket || !isConnected) {
        console.warn("Cannot join rooms: socket is not connected");
        return;
      }

      JoinConverstionsRooms(socket, conversationIds);
    },
    [socket, isConnected],
  );

  return {
    joinRooms,
    isConnected,
  };
};