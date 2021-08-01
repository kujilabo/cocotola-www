import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { problemFactory } from 'app/store';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { getWorkbook, selectWorkbook } from 'features/workbook_view';
import { getProblem, selectProblem } from 'features/problem_view';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _problemId: string;
};
export function PrivateProblemEdit(): JSX.Element {
  const { _workbookId, _problemId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const problemId = +_problemId;
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const problem = useAppSelector(selectProblem);
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => { return; };

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
    dispatch(
      getProblem({
        param: { workbookId: workbookId, problemId: problemId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, workbookId, problemId]);

  if (errorMessage !== '') {
    return <div>{errorMessage}</div>
  }
  if (+_workbookId !== workbook.id) {
    return <div>loading</div>;
  }
  if (+_problemId !== problem.id) {
    return <div>loading</div>;
  }

  return problemFactory.createProblemEdit(
    workbook.problemType,
    workbook,
    problem
  );
}
