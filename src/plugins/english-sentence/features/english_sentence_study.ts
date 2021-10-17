import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../../../app/store';

export interface EnglishSentenceState {
  status: number;
  ts: string;
  problemIds: number[];
}
const initialState: EnglishSentenceState = {
  status: 0,
  ts: '',
  problemIds: [],
};
export const englishSentenceSlice = createSlice({
  name: 'english_sentence',
  initialState: initialState,
  reducers: {
    initEnglishSentenceStatus: (state, action: PayloadAction<string>) => {
      console.log('initEnglishSentenceStatus', action.payload);
      state.status = 1;
      state.ts = action.payload;
    },
    setProblemIds: (state, action: PayloadAction<number[]>) => {
      console.log('setProblemIds', action.payload);
      state.problemIds = [...action.payload];
    },
    setEnglishSentenceStatus: (state, action: PayloadAction<number>) => {
      state.status = action.payload;
    },
  },
});

export const {
  initEnglishSentenceStatus,
  setProblemIds,
  setEnglishSentenceStatus,
} = englishSentenceSlice.actions;

export const selectEnglishSentenceStatus = (state: RootState): number =>
  state.englishSentence.status;

export const selectEnglishSentenceProblemIds = (state: RootState): number[] =>
  state.englishSentence.problemIds;

export const selectTs = (state: RootState): string => state.englishSentence.ts;

export default englishSentenceSlice.reducer;
