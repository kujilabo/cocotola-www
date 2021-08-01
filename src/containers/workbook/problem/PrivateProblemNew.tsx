import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { problemFactory } from 'app/store';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { getWorkbook, selectWorkbook } from 'features/workbook_view';

import 'App.css';

type ParamTypes = {
  _workbookId: string;
};
export function PrivateProblemNew(): JSX.Element {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
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

  if (errorMessage !== '') {
    return <div>{errorMessage}</div>
  }
  return problemFactory.createProblemNew(workbook.problemType, workbook);
}
