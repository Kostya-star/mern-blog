import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface TagsState {
  tags: [];
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
});

export const {} = tagsSlice.actions;

export default tagsSlice.reducer;
