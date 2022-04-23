import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AppDimmer } from 'components';
import { problemFactory } from 'app/store';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { getWorkbook, selectWorkbook } from 'features/workbook_get';
import {
  getProblem,
  selectProblem,
  selectProblemGetLoading,
} from 'features/problem_get';
import { emptyFunction } from 'utils/util';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _problemId: string;
};
export const PrivateProblemEdit = (): React.ReactElement => {
  const { _workbookId, _problemId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const problemId = +_problemId;
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const problem = useAppSelector(selectProblem);
  const problemLoading = useAppSelector(selectProblemGetLoading);
  const [errorMessage, setErrorMessage] = useState('');

  console.log('problem.version', problem.version);
  useEffect(() => {
    dispatch(
      getWorkbook({
        param: { id: workbookId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, workbookId]);

  useEffect(() => {
    console.log(
      'getProblem1',
      workbookId + ',' + problemId + ',' + ',' + problem.version
    );
    if (problemLoading) {
      return;
    }

    console.log(
      'getProblem2',
      workbookId + ',' + problemId + ',' + ',' + problem.version
    );
    dispatch(
      getProblem({
        param: { workbookId: workbookId, problemId: problemId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
    // }, [dispatch, workbookId, problemId]);
  }, [dispatch, workbookId, problemId, problem.version]);

  if (errorMessage !== '') {
    return <div>{errorMessage}</div>;
  }
  if (+_workbookId !== workbook.id) {
    return <AppDimmer />;
  }
  if (+_problemId !== problem.id || problemLoading) {
    return <AppDimmer />;
  }

  return problemFactory.createProblemEdit(
    workbook.problemType,
    workbook,
    problem
  );
};
