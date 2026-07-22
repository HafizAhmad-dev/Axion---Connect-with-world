import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../Types/Message.type";
import { addMessageToConversation } from "../../services/localStorageService";

interface MessagesState {
  [conversationId: string]: Message[];
}

const initialState: MessagesState = {};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
    ) => {
      state[action.payload.conversationId] = action.payload.messages;
    },

    //
    appendMessage: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message }>,
    ) => {
      const { conversationId, message } = action.payload
    

      if (!state[conversationId]) {
        state[conversationId] = [];
      }
      state[conversationId].push(message)

      addMessageToConversation(conversationId, message);
    },

    // replaces the entire message (instead of partial updates)
    updateMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        tempId: string;
        message: Message;
      }>,
    ) => {
      const messages = state[action.payload.conversationId];
      if (!messages) return;

      const index = messages.findIndex((m) => m.id === action.payload.tempId);
      if (index !== -1) {
        messages[index] = action.payload.message;
      }
      console.log("Updated message in state:", action.payload.message);
    },

    clearMessages: (state, action: PayloadAction<string>) => {
      delete state[action.payload]; // clear messages for a conversation
    },
  },
});

export const { setMessages, appendMessage, updateMessage, clearMessages } =
  messagesSlice.actions;

export default messagesSlice.reducer;
