import type { Socket } from "socket.io-client";
import { handleIncomingMessage } from "../Store/Thunks/chat.thunk";
import type { Message } from "../Types/Message.type";
import type { AppDispatch } from "../Store/store";


// ===============================
//           TYPES
// ===============================

interface MessagePayload {
  conversationId: string;
  message: Message;
}


// =====================================================================================
//    SETUP ALL LISTNERS
//  ====================================================================================

export const setupSocketListners = (
  dispatch:AppDispatch,
  socket: Socket,
): (() => void) => {

 const onNewMessage = (data: MessagePayload) => {
    dispatch(handleIncomingMessage(data));
  };

  socket.on("new_message", onNewMessage);

  return () => {
    socket.off("new_message", onNewMessage);
  };
};
