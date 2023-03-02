import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IFetchPostsQueryParams } from 'types/IFetchPostsQueryRequest';
import { INewPostRequest } from 'types/INewPostRequest';
import { IPost } from 'types/IPost';
import { IUpdatePostRequest } from 'types/IUpdatePostRequest';
import { IUploadImgResp } from 'types/IUploadImgResp';


export const uploadPostImage = createAsyncThunk(
  'images/uploadPostImage',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadImgResp>('/upload/postImg', formData);
    return resp.data;
  },
);

export const uploadUserPhoto = createAsyncThunk(
  'images/uploadUserPhoto',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadImgResp>('/upload/userPhoto', formData);
    return resp.data;
  },
);

// export interface PostsState {
//   posts: IPost[];
//   status: string;
// }

// const initialState: PostsState = {
//   posts: [],
//   status: '',
// };

// export const postsSlice = createSlice({
//   name: 'posts',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // FETCHING ALL POSTS
//       .addCase(fetchPosts.pending, (state) => {
//         state.posts = [];
//         state.status = 'loading';
//       })
//       .addCase(
//         fetchPosts.fulfilled,
//         (state, action: PayloadAction<IPost[]>) => {
//           state.status = 'success';
//           state.posts = action.payload;
//         },
//       )
//       .addCase(fetchPosts.rejected, (state) => {
//         state.status = 'error';
//         state.posts = [];
//       })

//       // DELETING A POST
//       .addCase(deletePost.fulfilled, (state, action) => {
//         state.posts = state.posts.filter(
//           (post) => post._id !== action.meta.arg,
//         );
//       });
//   },
// });

// export const {} = postsSlice.actions;

// export default postsSlice.reducer;
