import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IChat } from 'types/IChat';
import { IMessage } from 'types/IMessage';
import { INewMessageReq } from 'types/INewMessageReq';

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

export const getChatMessages = createAsyncThunk(
  'messanger/getChatMessages',
  async (chatId: string) => {
    const resp = await instance.get<IMessage[]>(`/chats/${chatId}/messages`);

    return resp.data;
  },
);

export const sendMessage = createAsyncThunk(
  'messanger/sendMessage',
  async (message: INewMessageReq) => {
    const resp = await instance.post<IMessage>(`/chats/message`, message);

    return resp.data;
  },
);

type Status = 'loading' | 'success' | 'error' | '';

export interface MessangerState {
  chats: IChat[];
  messages: IMessage[];
  chatStatus: Status;
  messagesStatus: Status;
}

const initialState: MessangerState = {
  chats: [],
  messages: [],
  chatStatus: 'loading',
  messagesStatus: 'loading'
};

export const messangerSlice = createSlice({
  name: 'messanger',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      const newMessage = action.payload;

      state.messages = [...state.messages, newMessage];

      state.chats = state.chats.map((chat) => {
        if (chat._id === newMessage.chat._id) {
          return {
            ...chat,
            latestMessage: {
              ...chat.latestMessage,
              text: newMessage.text,
              // createdAt: newMessage.createdAt,
            },
          };
        }
        return chat;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllChats
      .addCase(getAllChats.pending, (state) => {
        state.chatStatus = 'loading';
      })
      .addCase(
        getAllChats.fulfilled,
        (state, action: PayloadAction<IChat[]>) => {
          state.chats = action.payload;
          state.chatStatus = 'success';
        },
      )
      .addCase(getAllChats.rejected, (state) => {
        state.chatStatus = 'error';
      })

      // GET CHAT MESSAGES
      .addCase(getChatMessages.pending, (state) => {
        state.messagesStatus = 'loading';
      })
      .addCase(
        getChatMessages.fulfilled,
        (state, action: PayloadAction<IMessage[]>) => {
          state.messages = action.payload;
          state.messagesStatus = 'success';
        },
      )
      .addCase(getChatMessages.rejected, (state) => {
        state.messagesStatus = 'error';
      });
  },
});

export const { addMessage } = messangerSlice.actions;

export default messangerSlice.reducer;
