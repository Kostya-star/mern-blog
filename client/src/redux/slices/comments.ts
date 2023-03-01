import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IComment } from 'types/IComment';
import { ICreateCommentRequest } from 'types/ICreateCommentRequest';
import { ICreateCommentResponse } from 'types/ICreateCommentResponse';
import { IPost } from 'types/IPost';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async () => {
    const resp = await instance.get<IComment[]>('/comments');

    return resp.data;
  },
);

export const fetchCommentsByPostId = createAsyncThunk(
  'comments/fetchCommentsByPostId',
  async (postId: string) => {
    const resp = await instance.get<IComment[]>(`/comments/${postId}`);

    return resp.data;
  },
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (newComment: ICreateCommentRequest) => {
    const resp = await instance.post<ICreateCommentResponse>('/comments', newComment);

    return resp.data
  },
);

// export const updatePost = createAsyncThunk(
//   'posts/updatePost',
//   async ({id, updatedPost}: IUpdatePostRequest) => {

//     return await instance.patch(`/posts/${id}`, updatedPost)
//   }
// );

// export const deletePost = createAsyncThunk(
//   'posts/deletePost',
//   async (id: string) => await instance.delete(`/posts/${id}`),
// );

export interface CommentsState {
  comments: IComment[];
  status: string;
}

const initialState: CommentsState = {
  comments: [],
  status: '',
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCHING ALL COMMENTS
      .addCase(fetchComments.pending, (state) => {
        state.comments = [];
        state.status = 'loading';
      })
      .addCase(
        fetchComments.fulfilled,
        (state, action: PayloadAction<IComment[]>) => {
          state.status = 'success';
          state.comments = action.payload;
        },
      )
      .addCase(fetchComments.rejected, (state) => {
        state.status = 'error';
        state.comments = [];
      });

    // DELETING A POST
    // .addCase(deletePost.fulfilled, (state, action) => {
    //   state.posts = state.posts.filter(
    //     (post) => post._id !== action.meta.arg,
    //   );
    // });
  },
});

export const {} = commentsSlice.actions;

export default commentsSlice.reducer;
