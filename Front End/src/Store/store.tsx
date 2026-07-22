// Store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/UserSlice';
import conversationsReducer from './Slices/Conversations.slice';
import messagesReducer from './Slices/Messages.slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer,  // This now handles both conversations and currentConversation
    messages: messagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;