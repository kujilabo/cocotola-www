import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { extractErrorMessage } from './base';
import { RootState, AppDispatch } from '../app/store';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Add problem
export type NewProblemParameter = {
  number: number;
  problemType: string;
  properties: { [key: string]: string };
};
export type NewProblemArg = {
  workbookId: number;
  param: NewProblemParameter;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type NewProblemResponse = {
  id: number;
};
type NewProblemResult = {
  param: NewProblemParameter;
  response: NewProblemResponse;
};

export const addProblem = createAsyncThunk<
  NewProblemResult,
  NewProblemArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/new', async (arg: NewProblemArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem`;
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
          const response = resp.data as NewProblemResponse;
          arg.postSuccessProcess(response.id);
          const result = {
            param: arg.param,
            response: response,
          } as NewProblemResult;
          return result;
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
