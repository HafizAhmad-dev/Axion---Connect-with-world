import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { HighlightDataStructure, } from '../../Components/MockHiglights'
import HighlightsData from '../../Components/MockHiglights'

interface HighlightsState {
    highlights: HighlightDataStructure[];
}
const initialState: HighlightsState = {
    highlights: HighlightsData,
}
export const highlightsSlice = createSlice({
    name: 'highlightsSlice',
    initialState,
    reducers: {
        setHighlights: (state, action: PayloadAction<HighlightDataStructure[]>) => {
            state.highlights = action.payload
        },
        markAsSeen: (state, action: PayloadAction<string>) => {
            const highlight = state.highlights.find(hg => hg.id === action.payload);
            if (highlight) {
                highlight.seen = true;
            }
        },

    },
})

// Action creators are generated for each case reducer function
export const { setHighlights, markAsSeen } = highlightsSlice.actions

export default highlightsSlice.reducer