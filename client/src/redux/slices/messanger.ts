import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IChat } from 'types/IChat';

export const accessChat = createAsyncThunk(
  'messanger/getChat',
  async (userId: string) => {
    const resp = await instance.get<IChat>(`/chats/${userId}`);

    return resp.data;
  },
);

export const getAllChats = createAsyncThunk(
  'messanger/getAllChats',
  async () => {
    const resp = await instance.get<IChat[]>(`/chats`);

    return resp.data;
  },
);

type Status = 'loading' | 'success' | 'error' | '';

export interface MessangerState {
  chats: IChat[] | null;
  status: Status;
}

const initialState: MessangerState = {
  status: '',
  chats: [],
};

export const messangerSlice = createSlice({
  name: 'messanger',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // accessChat (either create a chat if there is no one, or get the existed chat)
      .addCase(getAllChats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllChats.fulfilled, (state, action: PayloadAction<IChat[]>) => {
        state.chats = action.payload
        state.status = 'success';
      })
      .addCase(getAllChats.rejected, (state) => {
        state.status = 'error';
      });
  },
});

export const {} = messangerSlice.actions;

export default messangerSlice.reducer;
