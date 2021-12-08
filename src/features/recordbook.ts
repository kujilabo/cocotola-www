import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { RecordbookModel } from 'models/recordbook';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/study/workbook`;

// Find recordbook
export type RecordbookViewParameter = {
  workbookId: number;
  studyType: string;
};
export type RecordbookViewArg = {
  param: RecordbookViewParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type RecordbookViewResult = {
  param: RecordbookViewParameter;
  response: RecordbookModel;
};

export const findRecordbook = createAsyncThunk<
  RecordbookViewResult,
  RecordbookViewArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('recordbook/view', async (arg: RecordbookViewArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/study_type/${arg.param.studyType}`;
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
          const response = resp.data as RecordbookModel;
          arg.postSuccessProcess();
          const result = {
            response: response,
          } as RecordbookViewResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface recordbookState {
  value: number;
  loading: boolean;
  failed: boolean;
  recordbook: RecordbookModel;
}

const defaultRecordbook = {
  id: 0,
  results: [],
};
const initialState: recordbookState = {
  value: 0,
  loading: false,
  failed: false,
  // recordbook: [new RecordbookModel(0, [])],
  recordbook: defaultRecordbook,
};

export const recordbookSlice = createSlice({
  name: 'problem_ids',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findRecordbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(findRecordbook.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.recordbook = action.payload.response;
      })
      .addCase(findRecordbook.rejected, (state, action) => {
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectProblemListLoading = (state: RootState) =>
  state.recordbook.loading;

export const selectProblemListFailed = (state: RootState) =>
  state.recordbook.failed;

export const selectRecordbook = (state: RootState) =>
  state.recordbook.recordbook;

export default recordbookSlice.reducer;
