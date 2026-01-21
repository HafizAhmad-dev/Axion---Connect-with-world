import { configureStore } from '@reduxjs/toolkit'
import { highlightsSlice } from './Slices/HighlightsSlice'
import { userSlice } from './Slices/UserSlice'

export const store = configureStore({
  reducer: {
    highlights: highlightsSlice.reducer,
    user:userSlice.reducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch