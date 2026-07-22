import type { AppDispatch, RootState } from "../store";
import { appendMessage } from "../Slices/Messages.slice";
import { updateConversationOnNewMessage } from "../Slices/Conversations.slice";
import type { Message } from "../../Types/Message.type";

interface MessagePayload {
  conversationId: string;
  message: Message;
}

export const handleIncomingMessage =
  (data: MessagePayload) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    const isActiveConversation =
      state.conversations.currentConversation?.id === data.conversationId;

    console.log(isActiveConversation);

    dispatch(
      appendMessage({
        conversationId: data.conversationId,
        message: data.message,
      })
    );

    dispatch(
      updateConversationOnNewMessage({
        conversationId: data.conversationId,
        lastMessage: data.message.content,
        lastMessageTime: data.message.createdAt,
        increaseUnread: !isActiveConversation,
      })
    );
  };