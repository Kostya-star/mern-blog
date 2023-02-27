import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { INewPostRequest } from 'types/INewPostRequest';
import { IPost } from 'types/IPost';
import { IUploadImgResp } from 'types/IUploadImgResp';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const resp = await instance.get<IPost[]>('/posts');
  return resp.data;
});

export const uploadPostImage = createAsyncThunk(
  'posts/uploadPostImage',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadImgResp>('/upload', formData);
    return resp.data;
  },
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (newPost: INewPostRequest) => {
    return await instance.post<IPost>('/posts', newPost);
  },
);

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
