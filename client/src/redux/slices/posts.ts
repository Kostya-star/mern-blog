import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IFetchPostById } from 'types/IFetchPostById';
import { IFetchPostsQueryParams } from 'types/IFetchPostsQueryRequest';
import { ILikePostResp } from 'types/ILikePostResp';
import { IPost } from 'types/IPost';
import { IUser } from './../../types/IUser';
import { clearCommentsSlice } from './comments';
import { IFollowUnfollowResp } from './../../types/IFollowUnfollowResp';
import { INewPostRequest } from 'types/INewPostRequest';
import { IUpdatePostRequest } from 'types/IUpdatePostRequest';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async ({ sortedCat, tag }: IFetchPostsQueryParams) => {
    const resp = await instance.get<IPost[]>(`/posts`, {
      params: {
        sortBy: sortedCat,
        tag,
      },
    });
    return resp.data;
  },
);

export const fetchPost = createAsyncThunk(
  'posts/fetchPost',
  async ({ id, isPostView }: IFetchPostById) => {
    const _isPostView = isPostView ? `?isPostView=true` : '';

    const resp = await instance.get<IPost>(`/posts/${id}${_isPostView}`);

    return resp.data;
  },
);

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (newPost: INewPostRequest) => {
    const resp = await instance.post<IPost>('/posts', newPost);

    return resp;
  },
);

export const updatePost = createAsyncThunk(
  'posts/updatePost',
  async ({
    newPost,
    postId,
  }: {
    newPost: IUpdatePostRequest;
    postId: string;
  }) => {
    return await instance.patch(`/posts/${postId}`, newPost);
  },
);

export const deletePost = createAsyncThunk(
  'posts/deletePost',
  async (id: string, thunkApi) => {
    await instance.delete(`/posts/${id}`);
    thunkApi.dispatch(clearCommentsSlice());
  },
);

export const likePost = createAsyncThunk(
  'posts/onLikePost',
  async (postId: string, thunkApi) => {
    const { data } = await instance.post<ILikePostResp>(`/posts/like`, {
      postId,
    });
    thunkApi.dispatch(updateLikeCount(data));
  },
);

export const fetchPostsByUserId = createAsyncThunk(
  'posts/fetchPostsByUserId',
  async (userId: string) => {
    const resp = await instance.get<IPost[]>(`/posts/user/${userId}`);

    return resp.data;
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
  reducers: {
    updateCommentCount: (
      state,
      action: PayloadAction<{
        postId: string;
        userId: string;
        operation: string;
      }>,
    ) => {
      const postId = action.payload.postId;
      const userId = action.payload.userId;
      const operation = action.payload.operation;

      state.posts = state.posts.map((post) => {
        if (post._id === postId) {
          if (operation === 'plus') {
            post = {
              ...post,
              usersCommented: [...post.usersCommented, userId],
            };
          } else if (operation === 'minus') {
            post = { ...post, usersCommented: [...post.usersCommented] };

            const firstUserId = post.usersCommented.findIndex(
              (user) => user === userId,
            );
            // if (firstUserId !== -1) {
            post.usersCommented.splice(firstUserId, 1);
            // }
          }
        }
        return post;
      });
    },
    updateLikeCount: (state, action: PayloadAction<ILikePostResp>) => {
      const { isLiked, userId, postId } = action.payload;
      const postToUpdate = state.posts.find(
        (post) => post._id === postId,
      ) as IPost;

      if (isLiked) {
        postToUpdate?.usersLiked.push(userId);
      } else {
        postToUpdate.usersLiked = postToUpdate?.usersLiked.filter(
          (id) => id !== userId,
        );
      }
    },

    updateFollowersForPosts: (
      state,
      action: PayloadAction<IFollowUnfollowResp>,
    ) => {
      const { followedUserId, followingUserId, isFollowed } = action.payload;

      const postsOfFollowedUser = state.posts.filter(
        (post) => post.user._id === followedUserId,
      );

      postsOfFollowedUser.map((post) => {
        if (isFollowed) {
          post.user.usersFollowed.push(followingUserId);
          return post;
        } else {
          post.user.usersFollowed = post.user.usersFollowed.filter(
            (userId) => userId !== followingUserId,
          );
          return post;
        }
      });
    },
  },
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
      // FETCH POSTS BY USER ID
      .addCase(fetchPostsByUserId.pending, (state) => {
        state.posts = [];
        state.status = 'loading';
      })
      .addCase(
        fetchPostsByUserId.fulfilled,
        (state, action: PayloadAction<IPost[]>) => {
          state.status = 'success';
          state.posts = action.payload;
        },
      )
      .addCase(fetchPostsByUserId.rejected, (state) => {
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

export const { updateCommentCount, updateLikeCount, updateFollowersForPosts } =
  postsSlice.actions;

export default postsSlice.reducer;
