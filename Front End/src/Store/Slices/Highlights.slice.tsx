import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FriendHighlights } from '../../Types/Highlights.types'
import type { Highlight } from '../../Types/Highlights.types';
type HighlightsState = {
  myHighlights:Highlight[]
    friendsHighlights: FriendHighlights[];
};

const initialState: HighlightsState = { 
    myHighlights: [],
    friendsHighlights: [],
};


const highlightsSlice = createSlice({
  name: 'highlights',
  initialState,
  reducers: {
    setFriendsHighlights(state, action: PayloadAction<FriendHighlights[]>) {
      state.friendsHighlights = action.payload;
    },

    setUserHighligths(state,action:PayloadAction<Highlight[]>){
      state.myHighlights = action.payload;
    },
  }
});

export const { setFriendsHighlights, setUserHighligths } = highlightsSlice.actions;
export default highlightsSlice.reducer;
