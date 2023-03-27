import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IUploadFileResp } from 'types/IUploadFileResp';

export const uploadFile = createAsyncThunk(
  'images/uploadFile',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadFileResp>('/upload/file', formData);

    return resp.data;
  },
);

export interface FilesState {}

const initialState: FilesState = {};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export const {} = filesSlice.actions;

export default filesSlice.reducer;
