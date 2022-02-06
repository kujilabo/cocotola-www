import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider } from 'semantic-ui-react';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { ErrorMessage, PrivateProblemBreadcrumb } from 'components';
import { selectProblem } from 'features/problem_get';
import { WorkbookModel } from 'models/workbook';
import { ProblemModel } from 'models/problem';
import { englishWordProblemEditFormikForm } from '../../../components/workbook/problem/EnglishWordProblemEditFormikForm';
import { emptyFunction } from 'utils/util';
import {
  findTatoebaSentences,
  selectTatoebaSentences,
} from 'plugins/tatoeba/features/tatoeba_find';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _problemId: string;
};
export const EnglishWordProblemEdit: React.FC<EnglishWordProblemEditProps> = (
  props: EnglishWordProblemEditProps
) => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const dispatch = useAppDispatch();
  const problem = useAppSelector(selectProblem);
  const tatoebaSentences = useAppSelector(selectTatoebaSentences);
  const [values, setValues] = useState({
    number: problem.number,
    text: '' + problem.properties['text'],
    pos: '' + problem.properties['pos'],
    lang: '' + problem.properties['lang'],
    translated: '' + problem.properties['translated'],
  });
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    if (values.text.length === 0) {
      return;
    }
    dispatch(
      findTatoebaSentences({
        param: {
          pageNo: 1,
          pageSize: 10,
          keyword: values.text,
          random: true,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, values.text]);

  const EnglishWordProblemEditFormikForm = englishWordProblemEditFormikForm(
    workbookId,
    problem,
    setErrorMessage,
    setValues
  );

  return (
    <Container fluid>
      <PrivateProblemBreadcrumb
        name={props.workbook.name}
        id={+_workbookId}
        text={'' + props.problem.number}
      />
      <Divider hidden />
      <EnglishWordProblemEditFormikForm
        number={values.number}
        text={values.text}
        pos={values.pos}
        lang={values.lang}
        translated={values.translated}
        tatoebaSentences={tatoebaSentences}
      />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishWordProblemEditProps = {
  workbook: WorkbookModel;
  problem: ProblemModel;
};
