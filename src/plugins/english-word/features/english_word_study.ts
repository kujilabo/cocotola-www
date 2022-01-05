import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/store';
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
      isReview: result.isReview,
      reviewLevel: result.reviewLevel,
      memorized: result.memorized,
    });
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
      const recordbook = action.payload;
      const records = [];
      for (const record of recordbook.records) {
        if (record.memorized) {
          continue;
        }

        records.push({
          problemId: record.problemId,
          level: record.level,
          isReview: false,
          reviewLevel: 0,
          memorized: false,
        });
      }
      state.recordbook.records = records;
      state.status = ENGLISH_WORD_STATUS_QUESTION;
      console.log('setEnglishWordRecordbook', state.recordbook);
    },
    setEnglishWordStatus: (state, action: PayloadAction<number>) => {
      console.log('setEnglishWordStatus', state.status);
      state.status = action.payload;
    },
    nextEnglishWordProblem: (state) => {
      // onsole.log('oldRecordbook', state);
      // onsole.log('oldRecordbook', state.recordbook);
      // onsole.log('state.recordbook.id', state.recordbook.id);
      const record = state.recordbook.records[0];
      // onsole.log('result', record);
      // onsole.log('length', state.recordbook.records.length);
      const problemId = record.problemId;
      // onsole.log('problemId', problemId);
      let level = record.level;

      const newRecordbook: RecordbookModel = removeProblemFromRecordbook(
        state.recordbook,
        problemId
      );

      // onsole.log('record.isReview', record.isReview);
      if (record.isReview) {
        const newIndexList = [3, 10, 15, 20, 0];
        if (state.lastResult) {
          record.reviewLevel++;
        } else {
          record.reviewLevel--;
        }
        record.reviewLevel = Math.min(record.reviewLevel, 4);
        record.reviewLevel = Math.max(record.reviewLevel, 0);

        if (record.reviewLevel !== 4) {
          const newIndex = Math.min(
            newIndexList[record.reviewLevel],
            newRecordbook.records.length - 1
          );
          // onsole.log('newIndex', newIndex);
          // Add problem to records
          newRecordbook.records.splice(newIndex, 0, {
            problemId,
            level,
            isReview: true,
            reviewLevel: record.reviewLevel,
            memorized: false,
          });
        }
      } else {
        if (!state.lastResult) {
          const newIndex = Math.min(3, newRecordbook.records.length - 1);
          // Add problem to records
          newRecordbook.records.splice(newIndex, 0, {
            problemId,
            level,
            isReview: true,
            reviewLevel: 0,
            memorized: false,
          });
        }
      }

      state.recordbook = newRecordbook;
      state.status = ENGLISH_WORD_STATUS_QUESTION;
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
