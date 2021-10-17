import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { ProblemWithLevelModel } from 'models/study';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/study/workbook`;

// Find problem id list
export type StudyProblemIdsSearchArg = {
  workbookId: number;
  studyType: string;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type StudyProblemIdsSearchResponse = {
  results: ProblemWithLevelModel[];
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
  const url = `${baseUrl}/${arg.workbookId}/study_type/${arg.studyType}`;
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

// Set study result
export type ParameterSetStudyResult = {
  result: boolean;
};
export type ArgSetStudyResult = {
  workbookId: number;
  studyType: string;
  problemId: number;
  param: ParameterSetStudyResult;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type ResponseSetStudyResult = {
  results: number[];
};
type ResultSetStudyResult = {
  response: ResponseSetStudyResult;
};

export const setStudyResult = createAsyncThunk<
  ResultSetStudyResult,
  ArgSetStudyResult,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('study/result', async (arg: ArgSetStudyResult, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/study_type/${arg.studyType}/problem/${arg.problemId}/result`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as ResponseSetStudyResult;
          arg.postSuccessProcess();
          const result = {
            response: response,
          } as ResultSetStudyResult;
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
  problemWithLevelList: ProblemWithLevelModel[];
}

const initialState: studyProblemIdsState = {
  value: 0,
  loading: false,
  failed: false,
  problemWithLevelList: [],
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
        state.problemWithLevelList = action.payload.response.results;
        console.log('problemIds', state.problemWithLevelList);
      })
      .addCase(findStudyProblemIds.rejected, (state, action) => {
        state.loading = false;
        state.failed = true;
      })
      .addCase(setStudyResult.pending, (state) => {
        state.loading = true;
      })
      .addCase(setStudyResult.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
      })
      .addCase(setStudyResult.rejected, (state, action) => {
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectProblemListLoading = (state: RootState) =>
  state.studyProblemIds.loading;

export const selectProblemListFailed = (state: RootState) =>
  state.studyProblemIds.failed;

export const selectProblemWithLevelList = (state: RootState) =>
  state.studyProblemIds.problemWithLevelList;

export default studyProblemIdsSlice.reducer;
