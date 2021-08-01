import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { refreshAccessToken } from './auth';
import { RootState, AppDispatch } from '../app/store';
import { extractErrorMessage } from './base';
import { ProblemModel } from '../models/problem';
import { removeProblem } from './problem_remove';

const baseUrl = `${process.env.REACT_APP_BACKEND}/v1/workbook`;

// Find problems
export type ProblemSearchParameter = {
  pageNo: number;
  pageSize: number;
  keyword: string;
};
export type ProblemSearchArg = {
  workbookId: number;
  param: ProblemSearchParameter;
  postSuccessProcess: () => void;
  postFailureProcess: (error: string) => void;
};
type ProblemSearchResponse = {
  results: ProblemModel[];
  totalCount: number;
};
type ProblemSearchResult = {
  param: ProblemSearchParameter;
  response: ProblemSearchResponse;
};

export const findProblems = createAsyncThunk<
  ProblemSearchResult,
  ProblemSearchArg,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>('problem/list', async (arg: ProblemSearchArg, thunkAPI) => {
  const url = `${baseUrl}/${arg.workbookId}/problem/search`;
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
          const response = resp.data as ProblemSearchResponse;
          arg.postSuccessProcess();
          const result = {
            param: arg.param,
            response: response,
          } as ProblemSearchResult;
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
