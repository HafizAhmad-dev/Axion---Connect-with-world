import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Conversation, Settings } from '../../Types/Conversation.type';


const initialState: Conversation = {
    id: 'noConversation',
    participants: [],
    lastMessage: '',
    lastMessageTime: '',
    unreadCount: 0,
    settings: { isMuted: false },
};

export const currentConversationSlice = createSlice({
    name: 'currentConversation',
    initialState,
    reducers: {
        setCurrentConversation: (_state, action: PayloadAction<Conversation>) => {
            return action.payload; // overwrite current conversation completely
        },
        updateLastMessage: (state, action: PayloadAction<{ text: string; timestamp: string }>) => {
            state.lastMessage = action.payload.text;
            state.lastMessageTime = action.payload.timestamp;
        },
        markAsRead: (state) => {
            state.unreadCount = 0;
        },
        updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
            state.settings = { ...state.settings, ...action.payload };
        },
    },
});

export const { setCurrentConversation, updateLastMessage, markAsRead, updateSettings } = currentConversationSlice.actions;
export default currentConversationSlice.reducer;
