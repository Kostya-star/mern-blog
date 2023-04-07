import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { RootState } from 'redux/store';
import { IFollowUnfollowResp } from 'types/IFollowUnfollowResp';
import { ILoginRequest } from 'types/ILoginRequest';
import { IRegisterRequest } from 'types/IRegisterRequest';
import { IUpdateUserReq } from 'types/IUpdateUserReq';
import { clearCommentsSlice } from './comments';
import { IUser } from './../../types/IUser';
import { IOnlineUser } from 'types/IOnlineUser';

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
  async (newUser: IRegisterRequest) => {
    try {
      const resp = await instance.post<IUser>('/auth/register', newUser);
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

export const updateUser = createAsyncThunk('auth/updateUser', async (updatedUser: IUpdateUserReq) => {
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



export interface authState {
  data: null | IUser;
  onlineUsers: IOnlineUser[]
  status: string;
}

const initialState: authState = {
  data: null,
  onlineUsers: [],
  status: '',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.status = '';
      state.data = null;
    },
    setOnlineUsers: (state, action: PayloadAction<IOnlineUser[]>) => {
      state.onlineUsers = action.payload
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
  },
});

export const isAuthSelector = ({ auth }: RootState) => Boolean(auth.data);

export const { logout, setOnlineUsers } = authSlice.actions;

export default authSlice.reducer;
