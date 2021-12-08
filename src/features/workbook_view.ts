import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, AppDispatch } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { WorkbookModel } from 'models/workbook';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/private/workbook';

// Find workbook
export type WorkbookViewParameter = {
  id: number;
};
export type WorkbookViewArg = {
  param: WorkbookViewParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type WorkbookViewResult = {
  param: WorkbookViewParameter;
  response: WorkbookModel;
};

export const findWorkbook = createAsyncThunk<
  WorkbookViewResult,
  WorkbookViewArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('workbook/view', async (arg: WorkbookViewArg, thunkAPI) => {
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
          const result = {
            param: arg.param,
            response: response,
          } as WorkbookViewResult;
          return result;
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
      .addCase(findWorkbook.pending, (state) => {
        state.loading = true;
      })
      .addCase(findWorkbook.fulfilled, (state, action) => {
        console.log('workbook', action.payload.response);
        state.loading = false;
        state.failed = false;
        state.workbook = action.payload.response;
      })
      .addCase(findWorkbook.rejected, (state, action) => {
        console.log('rejected', action);
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
