import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
import { WorkbookModel } from 'models/workbook';
import { jsonRequestConfig } from 'utils/util';

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
  BaseThunkApiConfig
>('private/workbook/list', async (arg: MyWorkbookSearchArg, thunkAPI) => {
  const url = `${baseUrl}/search`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then(() => {
      // onsole.log('accessToken1');
      const { accessToken } = thunkAPI.getState().auth;
      // onsole.log('accessToken', accessToken);
      return axios
        .post(url, arg.param, jsonRequestConfig(accessToken))
        .then((resp) => {
          // onsole.log('the1', resp);
          const response = resp.data as MyWorkbookSearchResponse;
          // onsole.log('the2', response);
          arg.postSuccessProcess();
          return {
            param: arg.param,
            response: response,
          } as MyWorkbookSearchResult;
        })
        .catch((err: Error) => {
          // console.log('catch', err);
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
        // onsole.log('workbooksLoadedMap', state.workbooksLoadedMap);
      })
      .addCase(findMyWorkbooks.rejected, (state, action) => {
        // onsole.log('rejected', action);
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
