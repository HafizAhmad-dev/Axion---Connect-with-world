import type { Socket } from "socket.io-client";


// ============================== JOINING THE ROOOMS ==============================

export function JoinConverstionsRooms(
  socket: Socket,
  conversationIds: string[],
) 

{
  socket.emit("join_conversations", conversationIds);
}
