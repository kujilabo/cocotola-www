import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../../app/store';

export interface EnglishWordState {
  status: number;
  ts: string;
  problemIds: number[];
}
const initialState: EnglishWordState = {
  status: 0,
  ts: '',
  problemIds: [],
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
    setProblemIds: (state, action: PayloadAction<number[]>) => {
      console.log('setProblemIds', action.payload);
      state.problemIds = [...action.payload];
    },
    setEnglishWordStatus: (state, action: PayloadAction<number>) => {
      state.status = action.payload;
    },
  },
});

export const { initEnglishWordStatus, setProblemIds, setEnglishWordStatus } =
  englishWordSlice.actions;

export const selectEnglishWordStatus = (state: RootState): number =>
  state.englishWord.status;

export const selectEnglishWordProblemIds = (state: RootState): number[] =>
  state.englishWord.problemIds;

export const selectTs = (state: RootState): string => state.englishWord.ts;

export default englishWordSlice.reducer;
