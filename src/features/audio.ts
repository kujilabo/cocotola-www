import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { AudioModel } from '../models/audio';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/audio';

// Find audio
export type AudioViewParameter = {
  id: number;
  updatedAt: string;
  postFunc: (value: string) => void;
};
export type AudioViewArg = {
  param: AudioViewParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type AudioViewReult = {
  param: AudioViewParameter;
  response: AudioModel;
};

export const getAudio = createAsyncThunk<
  AudioViewReult,
  AudioViewArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('audio/view', async (arg: AudioViewArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.id}`;
  console.log('accessToken1');
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then((resp) => {
      console.log('accessToken1');
      const { accessToken } = thunkAPI.getState().auth;
      console.log('accessToken', accessToken);
      return axios
        .get(url, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          data: {},
        })
        .then((resp) => {
          const response = resp.data as AudioModel;
          arg.postSuccessProcess();
          const result = {
            param: arg.param,
            response: response,
          } as AudioViewReult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface AudioViewState {
  value: number;
  loading: boolean;
  failed: boolean;
  audio: AudioModel;
}

const defaultAudio = {
  id: 0,
  content: '',
};
const initialState: AudioViewState = {
  value: 0,
  loading: false,
  failed: false,
  audio: defaultAudio,
};

export const audioSlice = createSlice({
  name: 'audio_view',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAudio.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAudio.fulfilled, (state, action) => {
        console.log('audio', action.payload.response);
        state.loading = false;
        state.failed = false;
        state.audio = action.payload.response;
      })
      .addCase(getAudio.rejected, (state, action) => {
        console.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectAudioViewLoading = (state: RootState) => state.audio.loading;

export const selectAudioListFailed = (state: RootState) => state.audio.failed;

export const selectAudio = (state: RootState) => state.audio.audio;

export default audioSlice.reducer;
