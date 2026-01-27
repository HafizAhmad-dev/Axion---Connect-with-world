import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UserType {
    username: string | null;
}
const initialState:UserType = {
    username: null,
}
export const chatPartnerSlice = createSlice({
    name: 'chatPartnerSlice',
    initialState,
    reducers: {
     setChatPartner:(state,action : PayloadAction<string | null>) => {
        state.username = action.payload;
     },

    },
})

export const { setChatPartner } = chatPartnerSlice.actions

export default chatPartnerSlice.reducer