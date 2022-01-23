import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState, BaseThunkApiConfig } from 'app/store';
import { refreshAccessToken } from 'features/auth';
import { extractErrorMessage } from 'features/base';
// import { TranslationModel } from '../models/translation';
import { jsonHeaders } from 'utils/util';

const baseUrl = process.env.REACT_APP_BACKEND + '/plugin/translation';

// Update translation
export type TranslationUpdateParameter = {
  version: number;
  text: string;
  pos: number;
  translated: string;
  lang: string;
};
export type TranslationUpdateArg = {
  param: TranslationUpdateParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type TranslationUpdateResult = {
  param: TranslationUpdateParameter;
};
export const updateTranslation = createAsyncThunk<
  TranslationUpdateResult,
  TranslationUpdateArg,
  BaseThunkApiConfig
>('translation/update', async (arg: TranslationUpdateArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.text}/${arg.param.pos}`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .put(url, { headers: jsonHeaders(accessToken), data: {} })
        .then((resp) => {
          arg.postSuccessProcess();
          return {
            param: arg.param,
          } as TranslationUpdateResult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface TranslationUpdateState {
  loading: boolean;
  failed: boolean;
}
const initialState: TranslationUpdateState = {
  loading: false,
  failed: false,
};

export const translationUpdateSlice = createSlice({
  name: 'translation_update',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(updateTranslation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTranslation.fulfilled, (state, action) => {
        // onsole.log('workbook', action.payload.response);
        state.loading = false;
        state.failed = false;
      })
      .addCase(updateTranslation.rejected, (state, action) => {
        // onsole.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectTranslationUpdateLoading = (state: RootState): boolean =>
  state.translationUpdate.loading;

export const selectTranslationUpdateFailed = (state: RootState): boolean =>
  state.translationUpdate.failed;

export default translationUpdateSlice.reducer;
