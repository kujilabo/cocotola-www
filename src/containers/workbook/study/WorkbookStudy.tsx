import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { problemFactory } from 'app/store';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  getWorkbook,
  selectWorkbook,
  selectWorkbookGetLoading,
} from 'features/workbook_view';
import {
  findAllProblems,
  selectProblemListLoading,
} from 'features/problem_list';
import {
  findRecordbook,
  selectRecordbookViewLoading,
} from 'features/recordbook';
import { emptyFunction } from 'utils/util';
import 'App.css';
import { AppDimmer } from 'components';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export function WorkbookStudy() {
  const { _workbookId, _studyType } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const workbookGetLoading = useAppSelector(selectWorkbookGetLoading);
  const problemListLoading = useAppSelector(selectProblemListLoading);
  const recordbookViewLoading = useAppSelector(selectRecordbookViewLoading);
  const [errorMessage, setErrorMessage] = useState('');

  // find workbook and all problems
  useEffect(() => {
    dispatch(
      getWorkbook({
        param: { id: +_workbookId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
    dispatch(
      findAllProblems({
        param: {
          workbookId: +_workbookId,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _workbookId]);

  // find recordbook
  useEffect(() => {
    dispatch(
      findRecordbook({
        param: {
          workbookId: +_workbookId,
          studyType: _studyType,
        },
        postSuccessProcess: () => {
          const now = new Date();
          const ts = now.toISOString();
          dispatch(problemFactory.initProblemStudy(workbook.problemType)(ts));
        },
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _workbookId, workbook.problemType]);

  if (workbookGetLoading || problemListLoading || recordbookViewLoading) {
    return <AppDimmer />;
  } else if (errorMessage !== '') {
    return <div>{errorMessage}</div>;
  }

  return problemFactory.createProblemStudy(workbook.problemType, _studyType);
}
