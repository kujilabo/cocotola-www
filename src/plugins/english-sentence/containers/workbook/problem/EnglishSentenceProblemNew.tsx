import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import { useAppSelector } from 'app/hooks';
import {
  selectWorkbook,
  selectWorkbookGetLoading,
} from 'features/workbook_get';
import { selectProblemAddLoading } from 'features/problem_add';

import { ErrorMessage } from 'components';
import { PrivateProblemBreadcrumb } from 'components/PrivateProblemBreadcrumb';
import { WorkbookModel } from 'models/workbook';

import { englishSentenceProblemNewFormikForm } from '../../../components/workbook/problem/EnglishSentenceProblemNewFormikForm';

import 'App.css';

type ParamTypes = {
  _workbookId: string;
};

export const EnglishSentenceProblemNew: React.FC<
  EnglishSentenceProblemNewProps
> = (props: EnglishSentenceProblemNewProps) => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const workbook = useAppSelector(selectWorkbook);
  const workbookGetLoading = useAppSelector(selectWorkbookGetLoading);
  const problemAddLoading = useAppSelector(selectProblemAddLoading);
  const [values, setValues] = useState({
    text: 'pen',
    lang2: 'ja',
    translated: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const loading = workbookGetLoading || problemAddLoading;

  const EnglishSentenceProblemNewFormikForm =
    englishSentenceProblemNewFormikForm(workbookId, setErrorMessage, setValues);

  return (
    <Container fluid>
      <PrivateProblemBreadcrumb
        name={workbook.name}
        id={workbookId}
        text={'New problem'}
      />
      <Divider hidden />
      <EnglishSentenceProblemNewFormikForm
        text={values.text}
        lang2={values.lang2}
        translated={values.translated}
        loading={loading}
      />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishSentenceProblemNewProps = {
  workbook: WorkbookModel;
};
