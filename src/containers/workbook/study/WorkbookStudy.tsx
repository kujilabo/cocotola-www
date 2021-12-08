import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { problemFactory } from 'app/store';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { findWorkbook, selectWorkbook } from 'features/workbook_view';
import { findProblems } from 'features/problem_list';
import { findRecordbook } from 'features/recordbook';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export function WorkbookStudy() {
  const { _workbookId, _studyType } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => {
    return;
  };

  useEffect(() => {
    dispatch(
      findWorkbook({
        param: { id: +_workbookId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
    dispatch(
      findProblems({
        workbookId: +_workbookId,
        param: {
          pageNo: 1,
          pageSize: 10,
          keyword: '',
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _workbookId]);

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

  if (+_workbookId !== workbook.id) {
    return <div>loading</div>;
  } else if (errorMessage !== '') {
    return <div>{errorMessage}xx</div>;
  }
  return problemFactory.createProblemStudy(workbook.problemType, _studyType);
}
