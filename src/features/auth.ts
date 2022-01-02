import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

import { RootState, AppDispatch } from 'app/store';
import { extractErrorMessage } from './base';

// RefreshToken
type RefreshTokenParameter = {
  refreshToken: string;
};

type RefreshTokenResponse = {
  accessToken: string;
};
export const tokenExpired = (token: string): boolean => {
  try {
    return jwtDecode<any>(token).exp < new Date().getTime() / 1000;
  } catch (e) {
    return true;
  }
};

export const refreshAccessToken = createAsyncThunk<
  RefreshTokenResponse,
  RefreshTokenParameter,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('auth/refresh_token', async (arg: RefreshTokenParameter, thunkAPI) => {
  // console.log('refreshAccessToken1 aaa');
  const { accessToken } = thunkAPI.getState().auth;
  const accessTokenExpired = tokenExpired(accessToken);
  // console.log('refreshAccessToken1 bbb');
  if (!accessTokenExpired) {
    // console.log('not expired');
    return new Promise(function (resolve) {
      const response: RefreshTokenResponse = { accessToken: accessToken };
      resolve(response);
    });
  }
  const x = await axios
    .post(process.env.REACT_APP_BACKEND + '/v1/auth/refresh_token', arg)
    .then((resp: any) => {
      // console.log('refreshAccessToken1 a');
      const response = resp.data as RefreshTokenResponse;
      return response;
    })
    .catch((err: Error) => {
      // console.log('refreshAccessToken1 b');
      const errorMessage = extractErrorMessage(err);
      return thunkAPI.rejectWithValue(errorMessage);
    });
  // console.log('refreshAccessToken1 ccc');
  return x;
});

// Callback
export type CallbackParameter = {
  organizationName: string;
  code: string;
};

export type CallbackArg = {
  param: CallbackParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};

type CallbackResponse = {
  accessToken: string;
  refreshToken: string;
};

export const callback = createAsyncThunk(
  'auth/callback',
  async (arg: CallbackArg, thunkAPI) => {
    return await axios
      .post(
        `${process.env.REACT_APP_BACKEND}/v1/auth/google/authorize`,
        arg.param
      )
      .then((resp) => {
        console.log('callback then');
        const response = resp.data as CallbackResponse;
        return response;
      })
      .catch((err: Error) => {
        console.log('callback err');
        const errorMessage = extractErrorMessage(err);
        arg.postFailureProcess(errorMessage);
        return thunkAPI.rejectWithValue(errorMessage);
      });
  }
);

export interface AuthState {
  loading: boolean;
  failed: boolean;
  accessToken: string;
  refreshToken: string;
}

const accessToken = localStorage.getItem('accessToken') || '';
const refreshToken = localStorage.getItem('refreshToken') || '';

const initialState: AuthState = {
  loading: false,
  failed: false,
  accessToken: accessToken,
  refreshToken: refreshToken,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('accessToken', state.accessToken);
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('refreshToken', state.refreshToken);
    },
    resetAccessToken: (state) => {
      state.accessToken = '';
      localStorage.setItem('accessToken', '');
    },
    resetRefreshToken: (state) => {
      state.refreshToken = '';
      localStorage.setItem('refreshToken', '');
    },
    logout: (state) => {
      state.accessToken = '';
      state.refreshToken = '';
      localStorage.setItem('accessToken', '');
      localStorage.setItem('refreshToken', '');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(callback.pending, (state) => {
        state.loading = true;
      })
      .addCase(callback.fulfilled, (state, action) => {
        authSlice.caseReducers.setAccessToken(state, action);
        authSlice.caseReducers.setRefreshToken(state, action);
        console.log('callback fulfilled');
        state.loading = false;
        state.failed = false;
      })
      .addCase(callback.rejected, (state, action) => {
        authSlice.caseReducers.resetAccessToken(state);
        authSlice.caseReducers.resetRefreshToken(state);
        console.log('callback rejected');
        state.loading = false;
        state.failed = true;
      })
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        console.log('refreshAccessToken1', action);
        authSlice.caseReducers.setAccessToken(state, action);
        state.loading = false;
        state.failed = false;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        console.log('rejected', action);
        authSlice.caseReducers.resetAccessToken(state);
        state.loading = false;
        state.failed = true;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthFailed = (state: RootState) => state.auth.failed;

export default authSlice.reducer;
