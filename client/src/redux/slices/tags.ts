import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { instance } from 'API/instance';

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const resp = await instance.get('/tags');
  return resp.data;
});

export interface TagsState {
  tags: string[];
  status: string;
}

const initialState: TagsState = {
  tags: [],
  status: '',
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.tags = [];
        state.status = 'loading';
      })
      .addCase(
        fetchTags.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          state.status = 'success';
          state.tags = action.payload;
        },
      )
      .addCase(fetchTags.rejected, (state) => {
        state.status = 'error';
        state.tags = [];
      });
  },

});

export const {} = tagsSlice.actions;

export default tagsSlice.reducer;
