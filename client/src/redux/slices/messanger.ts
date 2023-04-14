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

export const getAllMessages = createAsyncThunk(
  'messanger/getAllMessages',
  async () => {
    const resp = await instance.get<IMessage[]>('/chats/messages');

    return resp.data;
  },
);

// export const getChatMessages = createAsyncThunk(
//   'messanger/getChatMessages',
//   async (chatId: string) => {
//     const resp = await instance.get<IMessage[]>(`/chats/${chatId}/messages`);

//     return resp.data;
//   },
// );

export const sendMessage = createAsyncThunk(
  'messanger/sendMessage',
  async (message: INewMessageReq) => {
    const resp = await instance.post<IMessage>(`/chats/message`, message);

    return resp.data;
  },
);

export const deleteEmptyChats = createAsyncThunk(
  'messanger/deleteEmptyChats',
  () => {
    instance.delete(`/chats/empty`);
  },
);

export const updateMessageToRead = createAsyncThunk(
  'messanger/updateMessageToRead',
  (messageId: string) => {
    instance.patch(`/chats/message/${messageId}/read`);

    return messageId
  },
);

export const readAllChatsMessages = createAsyncThunk(
  'messanger/readAllChatsMessages',
  async (chatId: string) => {
    
    await instance.patch(`/chats/${chatId}/messages/readAll`);

    return chatId
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
  messagesStatus: 'loading',
};

export const messangerSlice = createSlice({
  name: 'messanger',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      const newMessage = action.payload;

      state.messages = [...state.messages, newMessage];
    },

    updateLatestMessage: (state, action: PayloadAction<IMessage>) => {
      const newMessage = action.payload;

      state.chats = state.chats.map((chat) => {
        if (chat._id === newMessage.chat._id) {
          return {
            ...chat,
            latestMessage: {
              ...chat.latestMessage,
              text: newMessage.text,
              imageUrl: newMessage.imageUrl
              // createdAt: newMessage.createdAt,
            } as IMessage,
          };
        }
        return chat;
      });
    },

    readMessage: (state, action: PayloadAction<string>) => {
      // console.log(action.payload);
      
      state.messages = state.messages.map((mess) =>
        mess._id === action.payload ? { ...mess, isRead: true } : mess,
      );
    },

    clearMessangerState: (state) => {
      state.chats = [];
      state.messages = [];
      state.chatStatus = 'loading';
      state.messagesStatus = 'loading';
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

      // GET ALL MESSAGES
      .addCase(getAllMessages.pending, (state) => {
        state.messagesStatus = 'loading';
      })
      .addCase(
        getAllMessages.fulfilled,
        (state, action: PayloadAction<IMessage[]>) => {
          state.messages = action.payload;
          state.messagesStatus = 'success';
        },
      )
      .addCase(getAllMessages.rejected, (state) => {
        state.messagesStatus = 'error';
      })

      // READ ALL CHAT'S MESSAGES
      .addCase(readAllChatsMessages.pending, (state) => {
        // state.messagesStatus = 'loading';
      })
      .addCase(
        readAllChatsMessages.fulfilled,
        (state, action: PayloadAction<string>) => {
          const chatId = action.payload;
          
          state.messages = state.messages.map((mess) =>
            mess.chat?._id === chatId ? { ...mess, isRead: true } : mess,
          );
        },
      )
      .addCase(readAllChatsMessages.rejected, (state) => {
        state.messagesStatus = 'error';
      })

    // .addCase(
    //   updateMessageToRead.fulfilled,
    //   (state, action: PayloadAction<string>) => {
    //     state.messages = state.messages.map((mess) =>
    //       mess._id === action.payload ? { ...mess, isRead: true } : mess,
    //     );
    //   },
    // )
    // GET CHAT MESSAGES
    // .addCase(getChatMessages.pending, (state) => {
    //   state.messagesStatus = 'loading';
    // })
    // .addCase(
    //   getChatMessages.fulfilled,
    //   (state, action: PayloadAction<IMessage[]>) => {
    //     state.messages = action.payload;
    //     state.messagesStatus = 'success';
    //   },
    // )
    // .addCase(getChatMessages.rejected, (state) => {
    //   state.messagesStatus = 'error';
    // });
  },
});

export const { addMessage, clearMessangerState, updateLatestMessage, readMessage } = messangerSlice.actions;

export default messangerSlice.reducer;
