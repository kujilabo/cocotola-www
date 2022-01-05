import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { RecordbookModel } from 'models/recordbook';
import { jsonHeaders, jsonRequestConfig } from 'utils/util';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/study/workbook`;

// Add record
export type RecordAddParameter = {
  workbookId: number;
  studyType: string;
  problemId: number;
  result: boolean;
  memorized: boolean;
};
export type RecordAddArg = {
  param: RecordAddParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type RecordAddResult = {
  param: RecordAddParameter;
};
export const addRecord = createAsyncThunk<
  RecordAddResult,
  RecordAddArg,
  BaseThunkApiConfig
>('record/add', async (arg: RecordAddArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/study_type/${arg.param.studyType}/problem/${arg.param.problemId}/record`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, jsonRequestConfig(accessToken))
        .then((resp) => {
          arg.postSuccessProcess();
          return { param: arg.param } as RecordAddResult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

// Find recordbook
export type RecordbookFindParameter = {
  workbookId: number;
  studyType: string;
};
export type RecordbookFindArg = {
  param: RecordbookFindParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type RecordbookFindResult = {
  param: RecordbookFindParameter;
  response: RecordbookModel;
};
export const findRecordbook = createAsyncThunk<
  RecordbookFindResult,
  RecordbookFindArg,
  BaseThunkApiConfig
>('recordbook/view', async (arg: RecordbookFindArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/study_type/${arg.param.studyType}`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .get(url, { headers: jsonHeaders(accessToken), data: {} })
        .then((resp) => {
          const response = resp.data as RecordbookModel;
          arg.postSuccessProcess();
          return { response: response } as RecordbookFindResult;
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

const defaultRecordbook: RecordbookModel = {
  id: 0,
  records: [],
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

export const selectRecordbookViewLoading = (state: RootState) =>
  state.recordbook.loading;

export const selectRecordbookViewFailed = (state: RootState) =>
  state.recordbook.failed;

export const selectRecordbook = (state: RootState) =>
  state.recordbook.recordbook;

export default recordbookSlice.reducer;
