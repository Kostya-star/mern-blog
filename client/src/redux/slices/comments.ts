import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IComment } from 'types/IComment';
import { ICreateCommentRequest } from 'types/ICreateCommentRequest';
import { IUpdateCommentReq } from 'types/IUpdateCommentReq';
import { updateCommentCount } from './posts';

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
    return { comments: resp.data, currentPost: postId };
  },
);

export const createComment = createAsyncThunk(
  'comments/createComment',
  async (newComment: ICreateCommentRequest, thunkApi) => {
    const resp = await instance.post<IComment>('/comments', newComment);
    thunkApi.dispatch(
      updateCommentCount({ postId: resp.data.post, operation: 'plus' }),
    );
    return resp.data;
  },
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async (updatedComment: IUpdateCommentReq) => {
    const resp = await instance.patch<IComment>(
      `/comments/${updatedComment.id}`,
      { text: updatedComment.text },
    );
    return resp.data;
  },
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commId: string, thunkApi) => {
    const resp = await instance.delete<{ id: string; postId: string }>(
      `/comments/${commId}`,
    );
    thunkApi.dispatch(
      updateCommentCount({ postId: resp.data.postId, operation: 'minus' }),
    );
    return resp.data;
  },
);

export interface CommentsState {
  currentPost: string;
  comments: IComment[];
  status: string;
}

const initialState: CommentsState = {
  currentPost: '',
  comments: [],
  status: '',
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsSlice: (state) => {
      state.comments = []
      state.currentPost = ''
      state.status = ''
    }
  },
  extraReducers: (builder) => {
    builder
      // FETCHING COMMENTS by post id
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.comments = [];
        state.status = 'loading';
      })
      .addCase(
        fetchCommentsByPostId.fulfilled,
        (
          state,
          action: PayloadAction<{ comments: IComment[]; currentPost: string }>,
        ) => {
          state.status = 'success';
          state.comments = action.payload.comments;
          state.currentPost = action.payload.currentPost;
        },
      )
      .addCase(fetchCommentsByPostId.rejected, (state) => {
        state.status = 'error';
        state.comments = [];
      })

      // CREATE A COMMENT
      .addCase(
        createComment.fulfilled,
        (state, action: PayloadAction<IComment>) => {
          state.status = 'success';
          state.comments = [...state.comments, action.payload];
        },
      )
      .addCase(createComment.rejected, (state) => {
        state.status = 'error';
        state.comments = [];
      })

      // UPDATE A COMMENT
      .addCase(
        updateComment.fulfilled,
        (state, action: PayloadAction<IComment>) => {
          state.status = 'success';

          state.comments = state.comments.map((comment) => {
            if (comment._id === action.payload._id) {
              return { ...comment, text: action.payload.text };
            }

            return comment;
          });
        },
      )
      .addCase(updateComment.rejected, (state) => {
        state.status = 'error';
        state.comments = [];
      })
      // DELETE A COMMENT
      .addCase(
        deleteComment.fulfilled,
        (state, action: PayloadAction<{ id: string }>) => {
          state.status = 'success';
          state.comments = state.comments.filter(
            (comment) => comment._id !== action.payload.id,
          );
        },
      );
  },
});

export const {clearCommentsSlice} = commentsSlice.actions;

export default commentsSlice.reducer;
