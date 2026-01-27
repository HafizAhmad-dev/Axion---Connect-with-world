import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Highlight } from '../../MockData/MockHiglights'

interface UserType {
    id:string;
    username: string;
    highlights: Highlight[]; // array of highlights
}
const initialState:UserType = {
    id: 'test_user',
    username: 'Test User',
    highlights: []
}
export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        addHighlight:(state,action : PayloadAction<Highlight>)=>{
            state.highlights.push(action.payload)
        },
        deleteHighlight:(state,action : PayloadAction<number>)=>{
            state.highlights.splice(action.payload,1)
        }

    },
})

// Action creators are generated for each case reducer function
export const { addHighlight, deleteHighlight } = userSlice.actions

export default userSlice.reducer