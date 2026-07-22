import { useSocket } from "../hooks/useSocket";
import { JoinConverstionsRooms } from "./socketEmittersService";

export const useSocketEmitters = () => {
  const { isConnected, socket } = useSocket();

  if (!socket || !isConnected) {
    console.warn("Socket Connection Not Found!");
    return;
  }

  const joinRooms = (conversatinIds: string[]) => {
    JoinConverstionsRooms(socket, conversatinIds);
  };

  return {
    joinRooms,
  };
};
