import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { ProblemModel } from 'models/problem';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/workbook';

// Find problem
export type ProblemViewParameter = {
  workbookId: number;
  problemId: number;
};
export type ProblemViewArg = {
  param: ProblemViewParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type ProblemViewReult = {
  param: ProblemViewParameter;
  response: ProblemModel;
};

export const getProblem = createAsyncThunk<
  ProblemViewReult,
  ProblemViewArg,
  BaseThunkApiConfig
>('problem/view', async (arg: ProblemViewArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/problem/${arg.param.problemId}`;
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
          const response = resp.data as ProblemModel;
          arg.postSuccessProcess();
          return { param: arg.param, response: response } as ProblemViewReult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface ProblemViewState {
  value: number;
  loading: boolean;
  failed: boolean;
  problem: ProblemModel;
}

const defaultProblem = {
  id: 0,
  version: 0,
  updatedAt: '',
  number: 0,
  problemType: '',
  properties: {},
};
const initialState: ProblemViewState = {
  value: 0,
  loading: false,
  failed: false,
  problem: defaultProblem,
};

export const problemViewSlice = createSlice({
  name: 'problem_view',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProblem.fulfilled, (state, action) => {
        console.log('problem', action.payload.response);
        state.loading = false;
        state.failed = false;
        state.problem = action.payload.response;
      })
      .addCase(getProblem.rejected, (state, action) => {
        console.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectProblemViewLoading = (state: RootState) =>
  state.problemView.loading;

export const selectProblem = (state: RootState) => state.problemView.problem;

export default problemViewSlice.reducer;
