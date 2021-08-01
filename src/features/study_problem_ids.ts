import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Find problem id list
export type StudyProblemIdsSearchArg = {
  workbookId: number;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type StudyProblemIdsSearchResponse = {
  results: number[];
};
type StudyProblemIdsSearchResult = {
  response: StudyProblemIdsSearchResponse;
};

export const findStudyProblemIds = createAsyncThunk<
  StudyProblemIdsSearchResult,
  StudyProblemIdsSearchArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem_id/list', async (arg: StudyProblemIdsSearchArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem_ids`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          data: {},
        })
        .then((resp) => {
          const response = resp.data as StudyProblemIdsSearchResponse;
          arg.postSuccessProcess();
          const result = {
            response: response,
          } as StudyProblemIdsSearchResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface studyProblemIdsState {
  value: number;
  loading: boolean;
  failed: boolean;
  problemIds: number[];
}

const initialState: studyProblemIdsState = {
  value: 0,
  loading: false,
  failed: false,
  problemIds: [],
};

export const studyProblemIdsSlice = createSlice({
  name: 'problem_ids',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findStudyProblemIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(findStudyProblemIds.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.problemIds = action.payload.response.results;
        console.log('problemIds', state.problemIds);
      })
      .addCase(findStudyProblemIds.rejected, (state, action) => {
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectProblemListLoading = (state: RootState) =>
  state.studyProblemIds.loading;

export const selectProblemListFailed = (state: RootState) =>
  state.studyProblemIds.failed;

export const selectProblemIds = (state: RootState) =>
  state.studyProblemIds.problemIds;

export default studyProblemIdsSlice.reducer;
