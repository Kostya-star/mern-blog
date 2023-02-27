import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/posts';
import tagsReducer from './slices/tags';
import authReducer from './slices/auth';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    tags: tagsReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
