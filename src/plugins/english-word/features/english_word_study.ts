import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/store';
import { RecordbookModel } from 'models/recordbook';

export interface EnglishWordState {
  status: number;
  ts: string;
  recordbook: RecordbookModel;
}
const defaultRecordbook = {
  id: 0,
  results: [],
};
const initialState: EnglishWordState = {
  status: 0,
  ts: '',
  recordbook: defaultRecordbook,
};
export const englishWordSlice = createSlice({
  name: 'english_word',
  initialState: initialState,
  reducers: {
    initEnglishWordStatus: (state, action: PayloadAction<string>) => {
      console.log('initEnglishWordStatus', action.payload);
      state.status = 1;
      state.ts = action.payload;
    },
    setEnglishWordRecordbook: (
      state,
      action: PayloadAction<RecordbookModel>
    ) => {
      console.log('setEnglishWordRecordbook', action.payload);
      state.recordbook = action.payload;
    },
    setEnglishWordStatus: (state, action: PayloadAction<number>) => {
      state.status = action.payload;
    },
  },
});

export const {
  initEnglishWordStatus,
  setEnglishWordRecordbook,
  setEnglishWordStatus,
} = englishWordSlice.actions;

export const selectEnglishWordStatus = (state: RootState): number =>
  state.englishWord.status;

export const selectEnglishWordRecordbook = (
  state: RootState
): RecordbookModel => state.englishWord.recordbook;

export const selectTs = (state: RootState): string => state.englishWord.ts;

export default englishWordSlice.reducer;
