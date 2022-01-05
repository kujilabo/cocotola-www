import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createLogger } from 'redux-logger';

import authReducer from 'features/auth';
import routerReducer from 'features/router';
import workbookNewReducer from 'features/workbook_new';
import workbookListReducer from 'features/workbook_list';
import workbookViewReducer from 'features/workbook_view';
import problemListReducer from 'features/problem_list';
import problemNewReducer from 'features/problem_new';
import problemUpdateReducer from 'features/problem_edit';
import problemViewReducer from 'features/problem_view';
import problemRemoveReducer from 'features/problem_remove';
import problemImportReducer from 'features/problem_import';
import recordbookReducer from 'features/recordbook';
import audioReducer from 'features/audio';
import { ProblemFactory } from 'containers/workbook/problem/ProblemFactory';
import { EnglishWordProblem } from 'plugins/english-word/containers/workbook/problem/EnglishWordProblem';

const englishWordProblem = new EnglishWordProblem();
export const problemFactory = new ProblemFactory({
  english_word: englishWordProblem,
});
const reducers = {
  englishWord: englishWordProblem.getReducer(),
};

export const rootReducer = combineReducers({
  ...reducers,
  auth: authReducer,
  router: routerReducer,

  workbookList: workbookListReducer,
  workbookNew: workbookNewReducer,
  workbookView: workbookViewReducer,
  problemList: problemListReducer,
  problemNew: problemNewReducer,
  problemUpdate: problemUpdateReducer,
  problemView: problemViewReducer,
  problemRemove: problemRemoveReducer,
  problemImport: problemImportReducer,
  recordbook: recordbookReducer,
  audio: audioReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['result'],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const logger = createLogger({
  diff: true,
  collapsed: true,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export type BaseThunkApiConfig = {
  dispatch: AppDispatch;
  state: RootState;
};
