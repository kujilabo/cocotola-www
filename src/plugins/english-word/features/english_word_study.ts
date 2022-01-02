import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/store';
// import { recordbookSlice } from 'features/recordbook';
import { RecordbookModel } from 'models/recordbook';

export const ENGLISH_WORD_STATUS_INIT = 1;
export const ENGLISH_WORD_STATUS_QUESTION = 2;
export const ENGLISH_WORD_STATUS_ANSWER = 3;

const removeProblemFromRecordbook = (
  recordbook: RecordbookModel,
  problemId: number
): RecordbookModel => {
  const newRecordbook: RecordbookModel = {
    id: recordbook.id,
    records: [],
  };
  console.log('newRecordbook', newRecordbook);
  for (const result of recordbook.records) {
    if (result.problemId === problemId) {
      continue;
    }
    newRecordbook.records.push({
      problemId: result.problemId,
      level: result.level,
      isReview: false,
      reviewLevel: 0,
    });
    console.log('loop result', newRecordbook.records);
  }
  return newRecordbook;
};
// Set result

export interface EnglishWordState {
  status: number;
  ts: string;
  recordbook: RecordbookModel;
  lastResult: boolean;
}
const defaultRecordbook: RecordbookModel = {
  id: 0,
  records: [],
};
const initialState: EnglishWordState = {
  status: 0,
  ts: '',
  recordbook: defaultRecordbook,
  lastResult: false,
};
export const englishWordSlice = createSlice({
  name: 'english_word',
  initialState: initialState,
  reducers: {
    initEnglishWordStatus: (state, action: PayloadAction<string>) => {
      console.log('initEnglishWordStatus', action.payload);
      state.status = ENGLISH_WORD_STATUS_INIT;
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
      console.log('setEnglishWordStatus', state.status);
      state.status = action.payload;
    },
    nextEnglishWordProblem: (state) => {
      console.log('oldRecordbook', state);
      console.log('oldRecordbook', state.recordbook);
      console.log('state.recordbook.id', state.recordbook.id);
      const record = state.recordbook.records[0];
      console.log('result', record);
      console.log('length', state.recordbook.records.length);
      const problemId = record.problemId;
      console.log('problemId', problemId);
      let level = record.level;

      if (record.isReview) {
        const newIndexList = [3, 10, 15, 20, 0];
        if (state.lastResult) {
          record.reviewLevel++;
        } else {
          record.reviewLevel--;
        }
        record.reviewLevel = Math.min(record.reviewLevel, 4);
        record.reviewLevel = Math.max(record.reviewLevel, 0);

        const newRecordbook: RecordbookModel = removeProblemFromRecordbook(
          state.recordbook,
          problemId
        );

        if (record.reviewLevel !== 4) {
          const newIndex = Math.min(
            newIndexList[record.reviewLevel],
            state.recordbook.records.length - 1
          );
          // Add problem to records
          newRecordbook.records.splice(newIndex, 0, {
            problemId,
            level,
            isReview: false,
            reviewLevel: 0,
          });
        }
        state.recordbook = newRecordbook;
        state.status = ENGLISH_WORD_STATUS_QUESTION;
        console.log('newRecordbook', newRecordbook);
      } else {
        const newRecordbook: RecordbookModel = removeProblemFromRecordbook(
          state.recordbook,
          problemId
        );

        if (!state.lastResult) {
          record.isReview = true;
          if (state.recordbook.records[0].isReview !== true) {
            alert('error');
          }
          const newIndex = Math.min(3, state.recordbook.records.length - 1);
          newRecordbook.records.splice(newIndex, 0, {
            problemId,
            level,
            isReview: false,
            reviewLevel: 0,
          });
        }

        state.recordbook = newRecordbook;
        state.status = ENGLISH_WORD_STATUS_QUESTION;
        console.log('newRecordbook', newRecordbook);
      }
    },
    setEnglishWordRecord: (state, action: PayloadAction<boolean>) => {
      state.lastResult = action.payload;
    },
  },
});

export const {
  initEnglishWordStatus,
  setEnglishWordRecordbook,
  setEnglishWordStatus,
  nextEnglishWordProblem,
  setEnglishWordRecord,
} = englishWordSlice.actions;

export const selectEnglishWordStatus = (state: RootState): number =>
  state.englishWord.status;

export const selectEnglishWordRecordbook = (
  state: RootState
): RecordbookModel => state.englishWord.recordbook;

export const selectTs = (state: RootState): string => state.englishWord.ts;

export default englishWordSlice.reducer;
