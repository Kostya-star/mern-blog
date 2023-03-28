import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IComment } from 'types/IComment';
import { ICreateCommentRequest } from 'types/ICreateCommentRequest';
import { ILikeCommResp } from 'types/ILikeCommResp';
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
      updateCommentCount({
        postId: resp.data.post,
        userId: resp.data.user._id,
        operation: 'plus',
      }),
    );
    return resp.data;
  },
);

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ comment, commId }: { comment: IUpdateCommentReq, commId: string }) => {

    const resp = await instance.patch<IComment>(
      `/comments/${commId}`,
      comment,
    );
    return resp.data;
  },
);

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commId: string, thunkApi) => {
    const resp = await instance.delete<{
      id: string;
      postId: string;
      userId: string;
    }>(`/comments/${commId}`);
    thunkApi.dispatch(
      updateCommentCount({
        postId: resp.data.postId,
        userId: resp.data.userId,
        operation: 'minus',
      }),
    );
    return resp.data;
  },
);

export const likeComment = createAsyncThunk(
  'comments/likeComment',
  async (commId: string, thunkApi) => {
    const { data } = await instance.post<ILikeCommResp>(`/comments/like`, {
      commId,
    });
    thunkApi.dispatch(updateCommentLike(data));
  },
);

export interface CommentsState {
  currentPost: string;
  comments: IComment[];
  status: string;
  isComments: boolean;
}

const initialState: CommentsState = {
  currentPost: '',
  comments: [],
  status: '',
  isComments: false,
};

export const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsSlice: (state) => {
      state.comments = [];
      state.currentPost = '';
      state.status = '';
      state.isComments = false;
    },
    updateCommentLike: (state, action: PayloadAction<ILikeCommResp>) => {
      const { isLiked, commId, userId } = action.payload;

      const commToUpdate = state.comments.find(
        (comm) => comm._id === commId,
      ) as IComment;

      if (isLiked) {
        commToUpdate?.usersLiked?.push(userId);
      } else {
        commToUpdate.usersLiked = commToUpdate?.usersLiked?.filter(
          (id) => id !== userId,
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCHING COMMENTS by post id
      .addCase(fetchCommentsByPostId.pending, (state) => {
        state.isComments = true;
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

          const updatedComm = action.payload;

          state.comments = state.comments.map((comment) => {
            if (comment._id === updatedComm._id) {
              return updatedComm;
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

export const { clearCommentsSlice, updateCommentLike } = commentsSlice.actions;

export default commentsSlice.reducer;
