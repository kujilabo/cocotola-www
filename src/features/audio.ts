import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, BaseThunkApiConfig } from 'app/store';
import { extractErrorMessage } from './base';
import { AudioModel } from 'models/audio';
import { jsonHeaders } from 'utils/util';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/audio';

// Find audio
export type AudioViewParameter = {
  id: number;
  updatedAt: string;
};
export type AudioViewArg = {
  param: AudioViewParameter;
  postFunc: (value: string) => void;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type AudioViewResult = {
  param: AudioViewParameter;
  response: AudioModel;
};

export const getAudio = createAsyncThunk<
  AudioViewResult,
  AudioViewArg,
  BaseThunkApiConfig
>('audio/get', async (arg: AudioViewArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.id}`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .get(url, { headers: jsonHeaders(accessToken), data: {} })
        .then((resp) => {
          const response = resp.data as AudioModel;
          arg.postSuccessProcess();
          arg.postFunc(response.audioContent);
          return { param: arg.param, response: response } as AudioViewResult;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface AudioViewState {
  loading: boolean;
  failed: boolean;
  audio: AudioModel;
}
const defaultAudio: AudioModel = {
  id: 0,
  lang: '',
  text: '',
  audioContent: '',
};
const initialState: AudioViewState = {
  loading: false,
  failed: false,
  audio: defaultAudio,
};

export const audioSlice = createSlice({
  name: 'audio_get',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAudio.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAudio.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.audio = action.payload.response;
      })
      .addCase(getAudio.rejected, (state, action) => {
        // onsole.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectAudioViewLoading = (state: RootState) => state.audio.loading;

export const selectAudioListFailed = (state: RootState) => state.audio.failed;

export const selectAudio = (state: RootState) => state.audio.audio;

export default audioSlice.reducer;
