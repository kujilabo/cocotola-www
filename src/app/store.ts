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
import workbookAddReducer from 'features/workbook_add';
import workbookFindReducer from 'features/workbook_find';
import workbookGetReducer from 'features/workbook_get';
import workbookUpdateReducer from 'features/workbook_update';
import workbookRemoveReducer from 'features/workbook_remove';
import problemFindReducer from 'features/problem_find';
import problemAddReducer from 'features/problem_add';
import problemUpdateReducer from 'features/problem_update';
import problemGetReducer from 'features/problem_get';
import problemRemoveReducer from 'features/problem_remove';
import problemImportReducer from 'features/problem_import';
import recordbookGetReducer from 'features/recordbook_get';
import recordAddReducer from 'features/record_add';
import audioReducer from 'features/audio';
import { ProblemFactory } from 'containers/workbook/problem/ProblemFactory';
import { EnglishWordProblem } from 'plugins/english-word/containers/workbook/problem/EnglishWordProblem';
import { EnglishSentenceProblem } from 'plugins/english-sentence/containers/workbook/problem/EnglishSentenceProblem';

// plugin
import translationFindReducer from 'plugins/translation/features/translation_find';
import translationGetReducer from 'plugins/translation/features/translation_get';
import translationGetListReducer from 'plugins/translation/features/translation_get_list';
import translationAddReducer from 'plugins/translation/features/translation_add';
import translationUpdateReducer from 'plugins/translation/features/translation_update';
import translationRemoveReducer from 'plugins/translation/features/translation_remove';
import translationImportReducer from 'plugins/translation/features/translation_import';
import translationExportReducer from 'plugins/translation/features/translation_export';
import tatoebaImportReducer from 'plugins/tatoeba/features/tatoeba_import';
import tatoebaSentenceFindReducer from 'plugins/tatoeba/features/tatoeba_find';

const englishWordProblem = new EnglishWordProblem();
const englishSentenceProblem = new EnglishSentenceProblem();
export const problemFactory = new ProblemFactory({
  english_word: englishWordProblem,
  english_sentence: englishSentenceProblem,
});
const reducers = {
  englishWord: englishWordProblem.getReducer(),
  englishSentence: englishSentenceProblem.getReducer(),
};

export const rootReducer = combineReducers({
  ...reducers,
  auth: authReducer,
  router: routerReducer,

  workbookFind: workbookFindReducer,
  workbookAdd: workbookAddReducer,
  workbookUpdate: workbookUpdateReducer,
  workbookGet: workbookGetReducer,
  workbookRemove: workbookRemoveReducer,
  problemFind: problemFindReducer,
  problemAdd: problemAddReducer,
  problemUpdate: problemUpdateReducer,
  problemGet: problemGetReducer,
  problemRemove: problemRemoveReducer,
  problemImport: problemImportReducer,
  recordbookGet: recordbookGetReducer,
  recordAdd: recordAddReducer,
  audio: audioReducer,
  // plugin
  translationFind: translationFindReducer,
  translationGet: translationGetReducer,
  translationGetList: translationGetListReducer,
  translationAdd: translationAddReducer,
  translationUpdate: translationUpdateReducer,
  translationRemove: translationRemoveReducer,
  translationImport: translationImportReducer,
  translationExport: translationExportReducer,
  tatoebaImport: tatoebaImportReducer,
  tatoebaSentenceFindSlice: tatoebaSentenceFindReducer,
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
