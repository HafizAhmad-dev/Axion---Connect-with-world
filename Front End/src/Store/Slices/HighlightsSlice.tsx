import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";

import type { FriendHighlights } from "../../Types/Highlights.types";

interface HighlightsState {
  highlights: FriendHighlights[];
}

const initialState: HighlightsState = {
  highlights: [],
};

export const highlightsSlice = createSlice({
  name: "highlights",
  initialState,

  reducers: {
    setHighlights: (
      state,
      action: PayloadAction<FriendHighlights[]>,
    ) => {
      state.highlights = action.payload;
    },

    markAsSeen: (
      state,
      action: PayloadAction<string>,
    ) => {
      for (const friend of state.highlights) {
        const highlight = friend.highlights.find(
          (highlight) => highlight.id === action.payload,
        );

        if (highlight) {
          highlight.viewed = true;
          break;
        }
      }
    },
  },
});

export const { setHighlights, markAsSeen } =
  highlightsSlice.actions;

export default highlightsSlice.reducer;