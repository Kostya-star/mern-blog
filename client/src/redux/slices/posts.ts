import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface PostsState {
  posts: [];
  status: string;
}

const initialState: PostsState = {
  posts: [],
  status: '',
};

export const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
});

export const {} = postsSlice.actions;

export default postsSlice.reducer;
