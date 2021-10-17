import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { AudioModel } from '../models/audio';

const baseUrl = process.env.REACT_APP_BACKEND + '/v1/audio';

// Find audio
export type AudioFindParameter = {
  id: number;
  updatedAt: string;
};
export type AudioFindArg = {
  param: AudioFindParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type AudioFindReult = {
  param: AudioFindParameter;
  response: AudioModel;
};

export const findAudio = createAsyncThunk<
  AudioFindReult,
  AudioFindArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('audio/find', async (arg: AudioFindArg, thunkAPI) => {
  const value = localStorage.getItem(`audio:${arg.param.id}`);
  const t = localStorage.getItem(`audio:${arg.param.id}:timestamp`);
  if (value && arg.param.updatedAt === t) {
    return new Promise(function (resolve) {
      const response = {
        id: arg.param.id,
        content: value,
      };
      const result = {
        param: arg.param,
        response: response,
      } as AudioFindReult;
      resolve(result);
    });
  }
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
          } as AudioFindReult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface AudioFindState {
  value: number;
  loading: boolean;
  failed: boolean;
  audio: AudioModel;
}

const defaultAudio = {
  id: 0,
  content: '',
};
const initialState: AudioFindState = {
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
      .addCase(findAudio.pending, (state) => {
        state.loading = true;
      })
      .addCase(findAudio.fulfilled, (state, action) => {
        console.log('audio', action.payload.response);
        state.loading = false;
        state.failed = false;
        state.audio = action.payload.response;
        localStorage.setItem(
          `audio:${action.payload.param.id}`,
          action.payload.response.content
        );
        localStorage.setItem(
          `audio:${action.payload.param}:timestamp`,
          action.payload.param.updatedAt
        );
      })
      .addCase(findAudio.rejected, (state, action) => {
        console.log('rejected', action);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const selectAudioFindLoading = (state: RootState) =>
  state.audioFind.loading;

export const selectAudioFindFailed = (state: RootState) =>
  state.audioFind.failed;

export const selectAudio = (state: RootState) => state.audioFind.audio;

export default audioSlice.reducer;
