import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { extractErrorMessage } from './base';
import { RootState, AppDispatch } from '../app/store';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Remove problem
export type ProblemRemoveParameter = {
  workbookId: number;
  problemId: number;
  version: number;
};
export type ProblemRemoveArg = {
  param: ProblemRemoveParameter;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type ProblemRemoveResponse = {
  id: number;
};
type ProblemRemoveResult = {
  param: ProblemRemoveParameter;
  response: ProblemRemoveResponse;
};

export const removeProblem = createAsyncThunk<
  ProblemRemoveResult,
  ProblemRemoveArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/remove', async (arg: ProblemRemoveArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/problem/${arg.param.problemId}?version=${arg.param.version}`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .delete(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as ProblemRemoveResponse;
          arg.postSuccessProcess(response.id);
          const result = {
            param: arg.param,
            response: response,
          } as ProblemRemoveResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface ProblemRemoveState {
  value: number;
  loading: boolean;
}

const initialState: ProblemRemoveState = {
  value: 0,
  loading: false,
};

export const problemRemoveSlice = createSlice({
  name: 'problem_remove',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(removeProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeProblem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(removeProblem.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectProblemEditLoading = (state: RootState): boolean =>
  state.problemRemove.loading;

export default problemRemoveSlice.reducer;
