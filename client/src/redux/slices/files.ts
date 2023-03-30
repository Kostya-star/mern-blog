import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';
import { IUploadFileResp } from 'types/IUploadFileResp';

export const uploadFile = createAsyncThunk(
  'images/uploadFile',
  async (formData: FormData) => {
    const resp = await instance.post<IUploadFileResp>('/upload/file', formData);
console.log(resp.data);

    return resp.data;
  },
);

type Status = 'loading' | 'success' | 'error' | ''

export interface FilesState {
  status: Status
}

const initialState: FilesState = {
  status: ''
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    // onLoginThunk
      .addCase(uploadFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(
        uploadFile.fulfilled,
        (state) => {
          state.status = 'success';
        },
      )
      .addCase(uploadFile.rejected, (state) => {
        state.status = 'error';
      })

  },
});

export const {} = filesSlice.actions;

export default filesSlice.reducer;
