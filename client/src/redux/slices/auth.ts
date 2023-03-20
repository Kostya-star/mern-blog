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
import { IUser } from './../../types/IUser';

export const onLogin = createAsyncThunk(
  'auth/onLogin',
  async (params: ILoginRequest) => {
    try {
      const resp = await instance.post<IUser>('/auth/login', params);
      return resp.data;
      
    } catch (serverErr: any) {
      const err = serverErr.response.data

      if(Array.isArray(err)) {
        const error = err.map((err: any) => err.msg).join(', ')
        throw new Error(error);
      } else {
        throw new Error(err.message);
      }
    }
  },
);

export const onRegister = createAsyncThunk(
  'auth/onRegister',
  async (formData: FormData) => {
    try {
      const resp = await instance.post<IUser>('/auth/register', formData);
      return resp.data;

    } catch (serverErr: any) {
      const err = serverErr.response.data

      if(Array.isArray(err)) {
        const error = err.map((err: any) => err.msg).join(', ')
        throw new Error(error);
      } else {
        throw new Error(err.message);
      }
    } 
  },
);

export const onAuthMeThunk = createAsyncThunk(
  'auth/onAuthMeThunk',
  async () => {
    const resp = await instance.get<IUser>('/auth/me');
    
    return resp.data;
  },
);

export const getUserById = createAsyncThunk('auth/getUserById', async(userId: string) => {
  const resp = await instance.get<IUser>(`/auth/${userId}`)
  
  return resp.data
}) 

export const updateUser = createAsyncThunk('auth/updateUser', async (updatedUser: FormData) => {
  try {
    const { data } = await instance.put<IUser>('auth/update', updatedUser)
    return data
    
  } catch (serverErr: any) {
    const err = serverErr.response.data
    
    if(Array.isArray(err)) {
      const error = err.map((err: any) => err.msg).join(', ')
      throw new Error(error);
    } else {
      throw new Error(err.message);
    }
  } 
})

export const deleteUser = createAsyncThunk('auth/deleteUser', async (_, thunkApi) => {
  const resp = await instance.delete<{ success: boolean }>('auth/delete')
  thunkApi.dispatch(clearCommentsSlice())
  return resp
})

export const follow_unfollow = createAsyncThunk('auth/follow_unfollow', async (followedUserId: string, thunkAPI) => {
  const { data } = await instance.post<IFollowUnfollowResp>('auth/follow', { followedUserId });
    
  thunkAPI.dispatch(updateFollowersForPosts(data))
  thunkAPI.dispatch(updateBrowsedProfileFollowers(data))
  return data
})

export interface authState {
  data: null | IUser;
  status: string;
  browsedUser: null | IUser;
  followStatus: string
}

const initialState: authState = {
  data: null,
  status: '',
  browsedUser: null,
  followStatus: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = '';
      state.data = null;
    },
    updateBrowsedProfileFollowers: (state, action: PayloadAction<IFollowUnfollowResp>) => {
      const  { followedUserId, followingUserId, isFollowed } = action.payload

      if(state.browsedUser) {
        if(isFollowed) {
          state.browsedUser.usersFollowed.push(followingUserId)
        } else {
          state.browsedUser = { ...state.browsedUser, usersFollowed: state.browsedUser.usersFollowed.filter(userId => userId !== followingUserId) }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
    // onLoginThunk
      .addCase(onLogin.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(
        onLogin.fulfilled,
        (state, action: PayloadAction<IUser | null>) => {
          state.status = 'success';
          state.data = action.payload;
        },
      )
      .addCase(onLogin.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })
      
      // onRegister
      .addCase(onRegister.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(
        onRegister.fulfilled,
        (state, action: PayloadAction<IUser | null>) => {
          state.status = 'success';
          state.data = action.payload;
        },
      )
      .addCase(onRegister.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })

      // onAuthMeThunk
      .addCase(onAuthMeThunk.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(
        onAuthMeThunk.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.status = 'success';
          state.data = action.payload;
        },
      )
      .addCase(onAuthMeThunk.rejected, (state) => {
        state.status = 'error';
        state.data = null;
      })

      // UPDATE USER
      .addCase(updateUser.pending, (state) => {
        // state.data = null;
        state.status = 'loading';
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<IUser | null>) => {
          if(action.payload) {
            state.status = 'success';
            state.data = action.payload;
          }
        },
      )
      .addCase(updateUser.rejected, (state) => {
        // state.status = 'error';
      })
      // DELETE USER
      .addCase(
        deleteUser.fulfilled,
        (state) => {
          state.status = 'success';
          state.data = null;
        },
        )

        // FOLLOW AND UNFOLLOW 

        .addCase(follow_unfollow.pending, (state) => {
          // state.data = null;
          state.followStatus = 'loading';
        })
        .addCase(
          follow_unfollow.fulfilled,
          (state, action: PayloadAction<IFollowUnfollowResp>) => {
              state.followStatus = 'success';
              // state.data = action.payload;
          },
        )
        .addCase(follow_unfollow.rejected, (state) => {
          state.followStatus = 'error';
        })

        //GET USER BY ID

        .addCase(getUserById.pending, (state) => {
          state.browsedUser = null;
          state.status = 'loading';
        })
        .addCase(
          getUserById.fulfilled,
          (state, action: PayloadAction<IUser>) => {
              state.status = 'success';
              state.browsedUser = action.payload;
          },
        )
        .addCase(getUserById.rejected, (state) => {
          state.status = 'error';
        })
  },
});

export const isAuthSelector = ({ auth }: RootState) => Boolean(auth.data);

export const { logout, updateBrowsedProfileFollowers } = authSlice.actions;

export default authSlice.reducer;
