// Store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './Slices/UserSlice';
import conversationsReducer from './Slices/Conversations.slice';
import messagesReducer from './Slices/Messages.slice';
import highlightsReducer from './Slices/Highlights.slice';
import errorReducer from './Slices/Errors.slice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    conversations: conversationsReducer, 
    messages: messagesReducer,
    highlights:highlightsReducer, 
    error:errorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;