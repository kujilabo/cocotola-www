import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { extractErrorMessage } from './base';
import { RootState, AppDispatch } from '../app/store';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/private/workbook';

// Add workbook
export type NewWorkbookParameter = {
  name: string;
  questionText: string;
  spaceKey: string;
};
export type NewWorkbookArg = {
  param: NewWorkbookParameter;
  postSuccessProcess: (id: number) => void;
  postFailureProcess: (error: string) => void;
};
type NewWorkbookResponse = {
  id: number;
};
type NewWorkbookResult = {
  param: NewWorkbookParameter;
  response: NewWorkbookResponse;
};

export const addWorkbook = createAsyncThunk<
  NewWorkbookResult,
  NewWorkbookArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('private/workbook/new', async (arg: NewWorkbookArg, thunkAPI) => {
  const url = baseUrl;
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
          const response = resp.data as NewWorkbookResponse;
          arg.postSuccessProcess(response.id);
          const result = {
            param: arg.param,
            response: response,
          } as NewWorkbookResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface WorkbookNewState {
  value: number;
  loading: boolean;
}

const initialState: WorkbookNewState = {
  value: 0,
  loading: false,
};

export const workbookNewSlice = createSlice({
  name: 'workbook_new',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addWorkbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addWorkbook.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(addWorkbook.rejected, (state, action) => {
        state.loading = false;
      });
  },
});

export const selectWorkbookNewLoading = (state: RootState): boolean =>
  state.workbookNew.loading;

export default workbookNewSlice.reducer;
