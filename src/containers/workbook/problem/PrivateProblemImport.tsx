import React, { ChangeEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Divider, Header, Form } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  AppDimmer,
  AppBreadcrumb,
  ErrorMessage,
  StandardButton,
} from 'components';
import {
  getWorkbook,
  selectWorkbookViewLoading,
  selectWorkbookListFailed,
  selectWorkbook,
} from 'features/workbook_view';
import { importProblem } from 'features/problem_import';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
}
export function PrivateProblemImport(): React.ReactElement {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const workbook = useAppSelector(selectWorkbook);
  const workbookViewLoading = useAppSelector(selectWorkbookViewLoading);
  const workbookViewFailed = useAppSelector(selectWorkbookListFailed);
  const dispatch = useAppDispatch();
  const [file, setFile] = useState({});
  // const [fileName, setFileName] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => { return; };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e == null || e.target == null || e.target.files == null) {
      return;
    }
    const fileList: FileList = e.target.files;
    if (fileList.item(0) == null) {
      return;
    }
    const file: File | null = fileList.item(0);
    if (file == null) {
      return;
    }
    setFile(file);
    // setFileName(file.name);
  };
  const uploadButtonClicked = () => {
    const formData = new FormData();
    formData.append('file', file as Blob);

    dispatch(
      importProblem({
        workbookId: workbookId,
        param: formData,
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  };


  useEffect(() => {
    dispatch(
      getWorkbook({
        param: { id: workbookId },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, workbookId]);

  if (workbookViewFailed) {
    return <div>failed</div>;
  }

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[
          { text: 'workbook', url: '/app/private/workbook' },
          { text: workbook.name, url: '/app/private/workbook/' + _workbookId },
        ]}
        text={'Import'}
      />
      <Divider hidden />
      <Card className="full-width">
        <Card.Content>
          <Header component="h2">Import problems</Header>
        </Card.Content>
        <Card.Content>
          <Form>
            <input type="file" name="text" onChange={handleFileChange} />
          </Form>
        </Card.Content>
        <Card.Content extra>
          {workbookViewLoading ? <AppDimmer /> : <div />}
          <StandardButton onClick={uploadButtonClicked} value="Upload" />
        </Card.Content>
      </Card>
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};
