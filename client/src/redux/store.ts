import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "./slices/posts";
import tagsReducer from "./slices/tags";

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    tags: tagsReducer
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch