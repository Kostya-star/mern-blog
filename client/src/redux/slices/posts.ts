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
export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async (id: string) => {
    const resp = await instance.get<IPost>(`/posts/${id}`);
    return resp.data;
  },
);

export const uploadPostImage = createAsyncThunk(
  'posts/uploadPostImage',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadImgResp>('/upload', formData);
    return resp.data;
  },
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (newPost: INewPostRequest) =>
    await instance.post<IPost>('/posts', newPost),
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string) => await instance.delete(`/posts/${id}`),
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
      // FETCHING ALL POSTS
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
      })

      // DELETING A POST
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.meta.arg,
        );
      });
  },
});

export const {} = postsSlice.actions;

export default postsSlice.reducer;
