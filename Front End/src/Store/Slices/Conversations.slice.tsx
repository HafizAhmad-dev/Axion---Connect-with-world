// Store/Slices/Conversations.slice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Conversation } from "../../Types/Conversation.type";
import {
  saveConversations,
  saveCurrentConversation,
  loadCurrentConversation,
} from "../../services/localStorageService";


interface ConversationState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
}

const initialState: ConversationState = {
  conversations: [],
  currentConversation: loadCurrentConversation(),
};

export const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
      saveConversations(action.payload);
    },

    addConversation: (state, action: PayloadAction<Conversation>) => {
      const exists = state.conversations.some(
        (c) => c.id === action.payload.id,
      );
      if (!exists) {
        state.conversations.unshift(action.payload);
        saveConversations(state.conversations);
      }
    },

    updateConversationOnNewMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        lastMessage: string;
        lastMessageTime: string;
        increaseUnread?: boolean;
      }>,
    ) => {
      const {
        conversationId,
        lastMessage,
        lastMessageTime,
        increaseUnread = false,
      } = action.payload;

      const index = state.conversations.findIndex(
        (c) => c.id === conversationId,
      );

      if (index === -1) return;

      const conversation = state.conversations[index];

      conversation.lastMessage = lastMessage;
      conversation.lastMessageTime = lastMessageTime;
      conversation.updatedAt = lastMessageTime;

     console.log("Reducer called");
console.log({
  increaseUnread,
  before: conversation.unreadCount,
});

if (increaseUnread) {
  conversation.unreadCount++;
} else {
  conversation.unreadCount = 0;
}

console.log({
  after: conversation.unreadCount,
});

      // Move conversation to the top
      const [moved] = state.conversations.splice(index, 1);
      state.conversations.unshift(moved);

      saveConversations(state.conversations);

      if (state.currentConversation?.id === conversationId) {
        state.currentConversation.lastMessage = lastMessage;
        state.currentConversation.lastMessageTime = lastMessageTime;
        state.currentConversation.updatedAt = lastMessageTime;

        if (!increaseUnread) {
          state.currentConversation.unreadCount = 0;
        }

        saveCurrentConversation(state.currentConversation);
      }
    },

    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const conversation = state.conversations.find(
        (c) => c.id === action.payload,
      );
      if (conversation) {
        conversation.unreadCount = 0;
        saveConversations(state.conversations);
      }
      // Reset in current conversation too
      if (state.currentConversation?.id === action.payload) {
        state.currentConversation.unreadCount = 0;
        saveCurrentConversation(state.currentConversation);
      }
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload,
      );
      saveConversations(state.conversations);
      // Clear current conversation if removed
      if (state.currentConversation?.id === action.payload) {
        state.currentConversation = null;
        saveCurrentConversation(null);
      }
    },

    clearConversations: (state) => {
      state.conversations = [];
      state.currentConversation = null;
      saveConversations([]);
      saveCurrentConversation(null);
    },

    // Set current conversation when chat is opened
    setCurrentConversation: (state, action: PayloadAction<Conversation>) => {
      state.currentConversation = action.payload;
      saveCurrentConversation(action.payload);
    },

    // Clear current conversation when chat is closed
    clearCurrentConversation: (state) => {
      state.currentConversation = null;
      saveCurrentConversation(null);
    },
  },
});

export const {
  setConversations,
  addConversation,
  updateConversationOnNewMessage,
  resetUnreadCount,
  removeConversation,
  clearConversations,
  setCurrentConversation,
  clearCurrentConversation,
} = conversationSlice.actions;

export default conversationSlice.reducer;
