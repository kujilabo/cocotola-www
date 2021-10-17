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
import problemEditReducer from 'features/problem_edit';
import problemViewReducer from 'features/problem_view';
import problemRemoveReducer from 'features/problem_remove';
import problemImportReducer from 'features/problem_import';
import studyProblemIdsReducer from 'features/study_problem_ids';
// import studyResultReducer from 'features/study_result';
import audioFindReducer from 'features/audio_find';
import { ProblemFactory } from 'containers/workbook/problem/ProblemFactory';
import { EnglishWordProblem } from 'plugins/english-word/containers/workbook/problem/EnglishWordProblem';
import { EnglishSentenceProblem } from 'plugins/english-sentence/containers/workbook/problem/EnglishSentenceProblem';

import ewJaJson from 'plugins/english-word/locales/ja.json';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    ja: { translation: ewJaJson },
  },
  lng: 'ja',
});

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

  workbookList: workbookListReducer,
  workbookNew: workbookNewReducer,
  workbookView: workbookViewReducer,
  problemList: problemListReducer,
  problemNew: problemNewReducer,
  problemEdit: problemEditReducer,
  problemView: problemViewReducer,
  problemRemove: problemRemoveReducer,
  problemImport: problemImportReducer,
  studyProblemIds: studyProblemIdsReducer,
  audioFind: audioFindReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['result', 'audio/find'],
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
