import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { ProblemModel } from '../models/problem';
import { removeProblem } from './problem_remove';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Find problems
export type ProblemFindParameter = {
  workbookId: number;
  pageNo: number;
  pageSize: number;
  keyword: string;
};
export type ProblemFindArg = {
  param: ProblemFindParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type ProblemFindResponse = {
  results: ProblemModel[];
  totalCount: number;
};
type ProblemFindResult = {
  param: ProblemFindParameter;
  response: ProblemFindResponse;
};

export const findProblems = createAsyncThunk<
  ProblemFindResult,
  ProblemFindArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/list', async (arg: ProblemFindArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/problem/find`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then(() => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as ProblemFindResponse;
          arg.postSuccessProcess();
          const result = {
            param: arg.param,
            response: response,
          } as ProblemFindResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

// Find all problems
export type ProblemFindAllParameter = {
  workbookId: number;
};
export type ProblemFindAllArg = {
  param: ProblemFindAllParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type ProblemFindAllResponse = {
  results: ProblemModel[];
  totalCount: number;
};
type ProblemFindAllResult = {
  param: ProblemFindAllParameter;
  response: ProblemFindAllResponse;
};
export const findAllProblems = createAsyncThunk<
  ProblemFindAllResult,
  ProblemFindAllArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/find_all', async (arg: ProblemFindAllArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.param.workbookId}/problem/find_all`;
  const { refreshToken } = thunkAPI.getState().auth;
  return await thunkAPI
    .dispatch(refreshAccessToken({ refreshToken: refreshToken }))
    .then(() => {
      const { accessToken } = thunkAPI.getState().auth;
      return axios
        .post(url, arg.param, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((resp) => {
          const response = resp.data as ProblemFindAllResponse;
          arg.postSuccessProcess();
          const result = {
            param: arg.param,
            response: response,
          } as ProblemFindAllResult;
          return result;
        })
        .catch((err: Error) => {
          const errorMessage = extractErrorMessage(err);
          arg.postFailureProcess(errorMessage);
          return thunkAPI.rejectWithValue(errorMessage);
        });
    });
});

export interface problemListState {
  value: number;
  loading: boolean;
  failed: boolean;
  problems: ProblemModel[];
  problemMap: { [key: number]: ProblemModel };
  problemsTotalCount: number;
}

const initialState: problemListState = {
  value: 0,
  loading: false,
  failed: false,
  problems: [],
  problemMap: {},
  problemsTotalCount: 0,
};

export const problemListSlice = createSlice({
  name: 'problem_list',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // findProblems
      .addCase(findProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(findProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.problems = action.payload.response.results;
        state.problemMap = {};
        for (let i = 0; i < state.problems.length; i++) {
          const problem = state.problems[i];
          state.problemMap[problem.id] = problem;
        }
        state.problemsTotalCount = action.payload.response.totalCount;
      })
      .addCase(findProblems.rejected, (state) => {
        state.loading = false;
        state.failed = true;
      })
      // findAllProblems
      .addCase(findAllProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(findAllProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.failed = false;
        state.problems = action.payload.response.results;
        state.problemMap = {};
        for (let i = 0; i < state.problems.length; i++) {
          const problem = state.problems[i];
          state.problemMap[problem.id] = problem;
        }
        state.problemsTotalCount = action.payload.response.totalCount;
      })
      .addCase(findAllProblems.rejected, (state) => {
        state.loading = false;
        state.failed = true;
      })
      .addCase(removeProblem.fulfilled, (state, action) => {
        const removedProblemId = action.payload.param.problemId;
        state.problems = state.problems.filter((n) => n.id == removedProblemId);
        state.problemMap = {};
        for (let i = 0; i < state.problems.length; i++) {
          const problem = state.problems[i];
          state.problemMap[problem.id] = problem;
        }
      });
  },
});

export const selectProblemListLoading = (state: RootState): boolean =>
  state.problemList.loading;

export const selectProblemListFailed = (state: RootState): boolean =>
  state.problemList.failed;

export const selectProblems = (state: RootState): ProblemModel[] =>
  state.problemList.problems;

export const selectProblemMap = (
  state: RootState
): { [key: number]: ProblemModel } => state.problemList.problemMap;

export const selectProblemsTotalCount = (state: RootState): number =>
  state.problemList.problemsTotalCount;

export default problemListSlice.reducer;
