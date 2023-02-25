import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IPost } from 'types/IPost';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const resp = await instance.get<IPost[]>('/posts');
  return resp.data;
});

export interface PostsState {
  posts: IPost[];
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
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.posts = [];
        state.status = 'loading';
      })
      .addCase(
        fetchPosts.fulfilled,
        (state, action: PayloadAction<IPost[]>) => {
          state.status = 'success';
          state.posts = action.payload;
        },
      )
      .addCase(fetchPosts.rejected, (state) => {
        state.status = 'error';
        state.posts = [];
      });
  },
});

export const {} = postsSlice.actions;

export default postsSlice.reducer;
