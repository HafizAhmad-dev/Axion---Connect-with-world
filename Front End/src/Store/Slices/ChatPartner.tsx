import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface UserType {
    id: string;
    username: string | null;
    isOnline: boolean;
}

const initialState: UserType = {
    id: 'noUser',
    username: null,
    isOnline: false,
};

interface ChatPartnerPayload {
    id: string;
    username: string;
}

export const chatPartnerSlice = createSlice({
    name: 'chatPartnerSlice',
    initialState,
    reducers: {
        setChatPartner: (state, action: PayloadAction<ChatPartnerPayload>) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
        },
        setStatus: (state, action: PayloadAction<boolean>) => {
            state.isOnline = action.payload;
        },
    },
});

export const { setChatPartner, setStatus } = chatPartnerSlice.actions;

export default chatPartnerSlice.reducer;
