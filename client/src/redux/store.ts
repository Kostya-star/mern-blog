import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/posts';
import tagsReducer from './slices/tags';
import authReducer from './slices/auth';
import commentsReducer from './slices/comments';
import profileReducer from './slices/userProfile'
import filesReducer from './slices/files'
import messangerReducer from './slices/messanger'

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    tags: tagsReducer,
    comments: commentsReducer,
    auth: authReducer,
    profile: profileReducer,
    files: filesReducer,
    messanger: messangerReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
