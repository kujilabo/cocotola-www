import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { extractErrorMessage } from './base';
import { RootState, AppDispatch } from '../app/store';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Import problem
export type ProblemImportArg = {
  workbookId: number;
  param: FormData;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type ProblemImportResponse = {
  id: number;
};
type ProblemImportResult = {
  param: FormData;
  response: ProblemImportResponse;
};

export const importProblem = createAsyncThunk<
  ProblemImportResult,
  ProblemImportArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/import', async (arg: ProblemImportArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem/import`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as ProblemImportResponse;
          arg.postSuccessProcess(response.id);
          const result = {
            param: arg.param,
            response: response,
          } as ProblemImportResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface ProblemImportState {
  value: number;
  loading: boolean;
}

const initialState: ProblemImportState = {
  value: 0,
  loading: false,
};

export const problemImportSlice = createSlice({
  name: 'problem_import',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(importProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(importProblem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(importProblem.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectProblemImportLoading = (state: RootState) =>
  state.problemImport.loading;

export default problemImportSlice.reducer;
