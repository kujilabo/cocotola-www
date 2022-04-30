import React, { useState } from 'react';
import { Container, Divider } from 'semantic-ui-react';

import { useAppSelector } from 'app/hooks';
import { selectWorkbookAddLoading } from 'features/workbook_add';
import { AppBreadcrumb, ErrorMessage } from 'components';
import 'App.css';
import { privateWorkbookNewFormikForm } from 'components/workbook/PrivateWorkbookNewFormikForm';

export const PrivateWorkbookNew = (): React.ReactElement => {
  const workbookAddLoading = useAppSelector(selectWorkbookAddLoading);
  const [values, setValues] = React.useState({
    name: '',
    lang2: 'ja',
    questionText: '',
    problemType: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const PrivateWorkbookNewFormikForm = privateWorkbookNewFormikForm(
    setErrorMessage,
    setValues
  );

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[{ text: 'workbook', url: '/app/private/workbook' }]}
        text={'New workbook'}
      />
      <Divider hidden />
      <PrivateWorkbookNewFormikForm
        loading={workbookAddLoading}
        name={values.name}
        lang2={values.lang2}
        questionText={values.questionText}
        problemType={values.problemType}
      />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};
