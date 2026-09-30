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
    // Replace all messages for a conversation
    setMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: Message[];
      }>,
    ) => {
      state[action.payload.conversationId] =
        action.payload.messages;
    },

    // Add/reconcile a message
    appendMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Message;
      }>,
    ) => {
      const { conversationId, message } = action.payload;

      if (!state[conversationId]) {
        state[conversationId] = [];
      }

      const messages = state[conversationId];

      /*
       * 1. Check the real database ID.
       *
       * This handles the case where the HTTP response
       * already replaced the optimistic message and
       * the same message then arrives through Socket.IO.
       */
      const existingById = messages.find(
        (m) => m.id === message.id,
      );

      if (existingById) {
        return;
      }

      /*
       * 2. Check the client-generated ID.
       *
       * This handles the case where the optimistic
       * message is still in Redux when the server
       * message arrives through Socket.IO.
       */
      const optimisticIndex = messages.findIndex(
        (m) =>
          m.clientMessageId === message.clientMessageId,
      );

      if (optimisticIndex !== -1) {
        messages[optimisticIndex] = message;

        addMessageToConversation(
          conversationId,
          message,
        );

        return;
      }

      /*
       * 3. Completely new incoming message.
       */
      messages.push(message);

      addMessageToConversation(
        conversationId,
        message,
      );
    },

    // Replace the optimistic message with the server message
    updateMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        clientMessageId: string;
        message: Message;
      }>,
    ) => {
      const messages =
        state[action.payload.conversationId];

      if (!messages) return;

      const index = messages.findIndex(
        (m) =>
          m.clientMessageId ===
          action.payload.clientMessageId,
      );

      if (index === -1) {
        return;
      }

      messages[index] = action.payload.message;

      addMessageToConversation(
        action.payload.conversationId,
        action.payload.message,
      );

      console.log(
        "Updated message in state:",
        action.payload.message,
      );
    },

    clearMessages: (
      state,
      action: PayloadAction<string>,
    ) => {
      delete state[action.payload];
    },
  },
});

export const {
  setMessages,
  appendMessage,
  updateMessage,
  clearMessages,
} = messagesSlice.actions;

export default messagesSlice.reducer;