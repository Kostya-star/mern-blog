import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { RootState } from 'redux/store';
import { ILoginRequest } from 'types/ILoginRequest';
import { IRegisterRequest } from 'types/IRegisterRequest';
import { IUser } from 'types/IUser';

export const onLoginThunk = createAsyncThunk(
  'auth/onLoginThunk',
  async (params: ILoginRequest) => {
    const resp = await instance.post<IUser>('/auth/login', params);
    return resp.data;
  },
);

export const onRegister = createAsyncThunk(
  'auth/onRegister',
  async (formData: FormData) => {
    const resp = await instance.post<IUser>('/auth/register', formData);
    return resp.data;
  },
);

export const onAuthMeThunk = createAsyncThunk(
  'auth/onAuthMeThunk',
  async () => {
    const resp = await instance.get<IUser>('/auth/me');
    
    return resp.data;
  },
);

export interface authState {
  data: null | IUser;
  status: string;
}

const initialState: authState = {
  data: null,
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
    deletePhoto: (state) => {
      // state.data.avatarUrl = ''
    }
  },
  extraReducers: (builder) => {
    builder
    // onLoginThunk
      .addCase(onLoginThunk.pending, (state) => {
        state.data = null;
        state.status = 'loading';
      })
      .addCase(
        onLoginThunk.fulfilled,
        (state, action: PayloadAction<IUser>) => {
          state.status = 'success';
          state.data = action.payload;
        },
      )
      .addCase(onLoginThunk.rejected, (state) => {
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
        (state, action: PayloadAction<IUser>) => {
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
      });
  },
});

export const isAuthSelector = ({ auth }: RootState) => Boolean(auth.data);

export const { logout, deletePhoto } = authSlice.actions;

export default authSlice.reducer;
