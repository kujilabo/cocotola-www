import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { WorkbookModel } from 'models/workbook';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/private/workbook';

// Get workbook
export type WorkbookGetParameter = {
  id: number;
};
export type WorkbookGetArg = {
  param: WorkbookGetParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type WorkbookGetResult = {
  param: WorkbookGetParameter;
  response: WorkbookModel;
};

export const getWorkbook = createAsyncThunk<
  WorkbookGetResult,
  WorkbookGetArg,
  BaseThunkApiConfig
>('workbook/view', async (arg: WorkbookGetArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.id}`;
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
          const response = resp.data as WorkbookModel;
          arg.postSuccessProcess();
          return { param: arg.param, response: response } as WorkbookGetResult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface WorkbookViewState {
  value: number;
  loading: boolean;
  failed: boolean;
  workbook: WorkbookModel;
}

const defaultWorkbook = {
  id: 0,
  version: 0,
  problemType: '',
  name: '',
  questionText: '',
  subscribed: false,
};
const initialState: WorkbookViewState = {
  value: 0,
  loading: false,
  failed: false,
  workbook: defaultWorkbook,
};

export const workbookViewSlice = createSlice({
  name: 'workbook_view',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWorkbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(getWorkbook.fulfilled, (state, action) => {
        // onsole.log('workbook', action.payload.response);
        state.loading = false;
        state.failed = false;
        state.workbook = action.payload.response;
      })
      .addCase(getWorkbook.rejected, (state, action) => {
        // onsole.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectWorkbookViewLoading = (state: RootState): boolean =>
  state.workbookView.loading;

export const selectWorkbookListFailed = (state: RootState): boolean =>
  state.workbookView.failed;

export const selectWorkbook = (state: RootState) => state.workbookView.workbook;

export default workbookViewSlice.reducer;
