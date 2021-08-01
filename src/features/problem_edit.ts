import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { extractErrorMessage } from './base';
import { RootState, AppDispatch } from '../app/store';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Update problem
export type EditProblemParameter = {
  number: number;
  problemType: string;
  properties: { [key: string]: string };
};
export type EditProblemArg = {
  workbookId: number;
  problemId: number;
  param: EditProblemParameter;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type EditProblemResponse = {
  id: number;
};
type EditProblemResult = {
  param: EditProblemParameter;
  response: EditProblemResponse;
};

export const updateProblem = createAsyncThunk<
  EditProblemResult,
  EditProblemArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/edit', async (arg: EditProblemArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem/${arg.problemId}`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .put(url, arg.param, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as EditProblemResponse;
          arg.postSuccessProcess(response.id);
          const result = {
            param: arg.param,
            response: response,
          } as EditProblemResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface ProblemEditState {
  value: number;
  loading: boolean;
}

const initialState: ProblemEditState = {
  value: 0,
  loading: false,
};

export const problemEditSlice = createSlice({
  name: 'problem_edit',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateProblem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProblem.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateProblem.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectProblemEditLoading = (state: RootState) =>
  state.problemEdit.loading;

export default problemEditSlice.reducer;
