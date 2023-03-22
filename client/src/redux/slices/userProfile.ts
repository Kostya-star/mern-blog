import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { RootState } from 'redux/store';
import { IFollowUnfollowResp } from 'types/IFollowUnfollowResp';
import { ILoginRequest } from 'types/ILoginRequest';
import { IRegisterRequest } from 'types/IRegisterRequest';
import { IUpdateUserReq } from 'types/IUpdateUserReq';
import { clearCommentsSlice } from './comments';
import { updateFollowersForPosts } from './posts';
import { IUser } from '../../types/IUser';
import { IFollowUnfollowPayload } from 'types/IFollowUnfollowPayload';

export const getUserProfileById = createAsyncThunk(
  'profile/getUserProfileById',
  async (userId: string) => {
    const resp = await instance.get<IUser>(`/profile/${userId}`);

    return resp.data;
  },
);

export const follow_unfollow = createAsyncThunk(
  'profile/follow_unfollow',
  async (followPayload: IFollowUnfollowPayload, thunkAPI) => {
    console.log(followPayload);
    
    const { data } = await instance.post<IFollowUnfollowResp>(
      'profile/follow',
      { followedUserId: followPayload.userId },
    );

    const authedUserId = (thunkAPI.getState() as RootState).auth.data?._id

    if(!followPayload.isFollowersModal) {
      thunkAPI.dispatch(updateFollowersForPosts(data));
      thunkAPI.dispatch(updateProfileFollowers(data));
    } else if(followPayload.isFollowersModal) {
      thunkAPI.dispatch(updateModalFollowers({ data, authedUserId }));
    }
    return data;
  },
);

export const getUserFollowers = createAsyncThunk(
  'profile/getUserFollowers',
  async (browsedUserId: string) => {
    
    const resp = await instance.get<IUser[]>(
      `profile/followers/${browsedUserId}`,
      );
      
    return resp.data;
  },
);

export const removeFollower = createAsyncThunk('profile/removeFollower', async (followerId: string, thunkAPI) => {
  const { data } = await instance.delete<{ deletedFollower: string }>(`profile/follower/${followerId}`)
  thunkAPI.dispatch(deleteFollower(data.deletedFollower))
  return data.deletedFollower
})

type Status = 'loading' | 'success' | 'error' | '';

export interface profileState {
  profile: {
    user: null | IUser;
    status: Status;
  };
  followers: {
    users: IUser[];
    status: Status;
  };
  following: {
    users: IUser[];
    status: Status;
  };
}

const initialState: profileState = {
  profile: {
    user: null,
    status: '',
  },
  followers: {
    users: [],
    status: '',
  },
  following: {
    users: [],
    status: '',
  },
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfileFollowers: (
      state,
      action: PayloadAction<IFollowUnfollowResp>,
    ) => {
      const { followedUserId, followingUserId, isFollowed } = action.payload;

      if (state.profile.user) {
        if (isFollowed) {
          state.profile.user.usersFollowed.push(followingUserId);
        } else {
          state.profile.user = {
            ...state.profile.user,
            usersFollowed: state.profile.user.usersFollowed.filter(
              (userId) => userId !== followingUserId,
            ),
          };
        }
      }
    },
    updateModalFollowers: (
      state,
      action: PayloadAction<{ data: IFollowUnfollowResp, authedUserId: string | undefined }>,
    ) => {
      const { followedUserId, followingUserId, isFollowed } = action.payload.data;
      const { authedUserId } = action.payload

      let followedUser = state.followers.users.find(user => user._id === followedUserId)

      if(followedUser) {
        if (isFollowed) {
          followedUser?.usersFollowed.push(followingUserId);
          if(state.profile.user?._id === authedUserId) {
            state.profile.user?.usersFollowing.push(followedUserId)
          }
        } else {
          followedUser = {
            ...followedUser,
            usersFollowed: followedUser.usersFollowed.filter(
              (userId) => userId !== followingUserId,
            ),
          };
        }
      }
    },

    deleteFollower: (state, action: PayloadAction<string>) => {
      const deletedFollowerId = action.payload
      state.followers.users = state.followers.users.filter(follower => follower._id !== deletedFollowerId)
      if(state.profile.user?.usersFollowed) {
        state.profile.user.usersFollowed = state.profile.user.usersFollowed.filter(followerId => followerId !== deletedFollowerId)
      }
    }
  },
  extraReducers: (builder) => {
    builder

      //GET USER'S PROFILE BY ID

      .addCase(getUserProfileById.pending, (state) => {
        state.profile.user = null;
        state.profile.status = 'loading';
      })
      .addCase(
        getUserProfileById.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.profile.user = action.payload;
          state.profile.status = 'success';
        },
      )
      .addCase(getUserProfileById.rejected, (state) => {
        state.profile.status = 'error';
      })

      // FOLLOW AND UNFOLLOW

      .addCase(follow_unfollow.pending, (state) => {
        // state.data = null;
        state.followers.status = 'loading';
      })
      .addCase(
        follow_unfollow.fulfilled,
        (state, action: PayloadAction<IFollowUnfollowResp>) => {
          state.followers.status = 'success';
          // state.data = action.payload;
        },
      )
      .addCase(follow_unfollow.rejected, (state) => {
        state.followers.status = 'error';
      })

      // GET USER'S FOLLOWERS

      .addCase(getUserFollowers.pending, (state) => {
        // state.data = null;
        state.followers.status = 'loading';
      })
      .addCase(
        getUserFollowers.fulfilled,
        (state, action: PayloadAction<IUser[]>) => {
          state.followers.status = 'success';
          state.followers.users = action.payload;
        },
      )
      .addCase(getUserFollowers.rejected, (state) => {
        state.followers.status = 'error';
      })

      // DELETE USER'S FOLLOWER

      .addCase(removeFollower.pending, (state) => {
        // state.data = null;
        state.followers.status = 'loading';
      })
      .addCase(
        removeFollower.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.followers.status = 'success';
          // state.followers.users = action.payload;
        },
      )
      .addCase(removeFollower.rejected, (state) => {
        state.followers.status = 'error';
      })
  },
});

export const { updateProfileFollowers, updateModalFollowers, deleteFollower } = profileSlice.actions;

export default profileSlice.reducer;
