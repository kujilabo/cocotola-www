import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { WorkbookModel } from '../models/workbook';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/private/workbook';

// Find my workbooks
export type MyWorkbookSearchParameter = {
  pageNo: number;
  pageSize: number;
  spaceKey: string;
};
export type MyWorkbookSearchArg = {
  param: MyWorkbookSearchParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type MyWorkbookSearchResponse = {
  results: WorkbookModel[];
  totalCount: number;
};
type MyWorkbookSearchResult = {
  param: MyWorkbookSearchParameter;
  response: MyWorkbookSearchResponse;
};

export const findMyWorkbooks = createAsyncThunk<
  MyWorkbookSearchResult,
  MyWorkbookSearchArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('private/workbook/list', async (arg: MyWorkbookSearchArg, thunkAPI) => {
  const url = `${baseUrl}/search`;
  console.log('accessToken1');
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then(() => {
      console.log('accessToken1');
      const { accessToken } = thunkAPI.getState().auth;
      console.log('accessToken', accessToken);
      return axios
        .post(url, arg.param, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          console.log('the1', resp);
          const response = resp.data as MyWorkbookSearchResponse;
          console.log('the2', response);
          arg.postSuccessProcess();
          const result = {
            param: arg.param,
            response: response,
          } as MyWorkbookSearchResult;
          return result;
        })
        .catch((err: Error) => {
          console.log('catch', err);
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface WorkbookListState {
  value: number;
  loading: boolean;
  failed: boolean;
  workbooksMap: { [key: string]: WorkbookModel[] };
  workbooksLoadedMap: { [key: string]: boolean };
  workbooks: WorkbookModel[];
  workbooksTotalCount: number;
}

const initialState: WorkbookListState = {
  value: 0,
  loading: false,
  failed: false,
  workbooksLoadedMap: {},
  workbooksMap: {},
  workbooks: [],
  workbooksTotalCount: 0,
};

export const workbookListSlice = createSlice({
  name: 'workbook_list',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(findMyWorkbooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(findMyWorkbooks.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.workbooks = action.payload.response.results;
        state.workbooksTotalCount = action.payload.response.totalCount;
        state.workbooksMap = {
          ...state.workbooksMap,
          [action.payload.param.spaceKey]: action.payload.response.results,
        };
        state.workbooksLoadedMap = {
          ...state.workbooksLoadedMap,
          [action.payload.param.spaceKey]: true,
        };
        console.log('workbooksLoadedMap', state.workbooksLoadedMap);
      })
      .addCase(findMyWorkbooks.rejected, (state, action) => {
        console.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectWorkbookListLoading = (state: RootState): boolean =>
  state.workbookList.loading;

export const selectWorkbookListFailed = (state: RootState): boolean =>
  state.workbookList.failed;

export const selectWorkbooksLoadedMap = (
  state: RootState
): { [key: string]: boolean } => state.workbookList.workbooksLoadedMap;

export const selectWorkbooksMap = (
  state: RootState
): { [key: string]: WorkbookModel[] } => state.workbookList.workbooksMap;

export default workbookListSlice.reducer;
