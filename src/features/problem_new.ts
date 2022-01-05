import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { jsonRequestConfig } from 'utils/util';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Add problem
export type ProblemAddParameter = {
  number: number;
  problemType: string;
  properties: { [key: string]: string };
};
export type ProblemAddArg = {
  workbookId: number;
  param: ProblemAddParameter;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type ProblemAddResponse = {
  id: number;
};
type ProblemAddResult = {
  param: ProblemAddParameter;
  response: ProblemAddResponse;
};

export const addProblem = createAsyncThunk<
  ProblemAddResult,
  ProblemAddArg,
  BaseThunkApiConfig
>('problem/new', async (arg: ProblemAddArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, jsonRequestConfig(accessToken))
        .then((resp) => {
          const response = resp.data as ProblemAddResponse;
          arg.postSuccessProcess(response.id);
          return { param: arg.param, response: response } as ProblemAddResult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface ProblemNewState {
  value: number;
  loading: boolean;
}

const initialState: ProblemNewState = {
  value: 0,
  loading: false,
};

export const problemNewSlice = createSlice({
  name: 'problem_new',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProblem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addProblem.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectProblemNewLoading = (state: RootState) =>
  state.problemNew.loading;

export default problemNewSlice.reducer;
