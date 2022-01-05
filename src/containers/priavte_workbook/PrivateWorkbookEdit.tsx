import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AppDimmer } from 'components';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { getWorkbook, selectWorkbook } from 'features/workbook_view';
import { emptyFunction } from 'utils/util';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
};
export const PrivateWorkbookEdit = (): React.ReactElement => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const [errorMessage, setErrorMessage] = useState('');

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
    return <div>{errorMessage}</div>;
  }
  if (+_workbookId !== workbook.id) {
    return <AppDimmer />;
  }

  return <div></div>;
};
