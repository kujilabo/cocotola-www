import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Card, Container, Divider, Header } from 'semantic-ui-react';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { Form, Input, Select } from 'formik-semantic-ui-react';
import * as Yup from 'yup';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { ErrorMessage, PrivateProblemBreadcrumb } from 'components';

import { updateProblem } from 'features/problem_update';
import { selectProblem } from 'features/problem_get';

import { WorkbookModel } from 'models/workbook';
import { ProblemModel, EnglishWordProblemTypeId } from 'models/problem';

import 'App.css';

const posOptions1 = [
  { key: 'ADJ', text: 'ADJ', value: '1' },
  { key: 'ADV', text: 'ADV', value: '2' },
  { key: 'CONJ', text: 'CONJ', value: '3' },
  { key: 'DET', text: 'DET', value: '4' },
  { key: 'NOUN', text: 'NOUN', value: '6' },
  { key: 'PREP', text: 'PREP', value: '7' },
  { key: 'PRON', text: 'PRON', value: '8' },
  { key: 'VERB', text: 'VERB', value: '9' },
  { key: '', text: '', value: '99' },
];
const langOptions = [{ key: 'ja', text: 'ja', value: 'ja' }];

type ParamTypes = {
  _workbookId: string;
  _problemId: string;
};
export const EnglishWordProblemEdit: React.FC<EnglishWordProblemEditProps> = (
  props: EnglishWordProblemEditProps
) => {
  const { _workbookId, _problemId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const problemId = +_problemId;
  const problem = useAppSelector(selectProblem);
  const dispatch = useAppDispatch();
  const history = useHistory();

  const [values, setValues] = useState({
    number: problem.number,
    text: '' + problem.properties['text'],
    pos: '' + problem.properties['pos'],
    lang: '' + problem.properties['lang'],
    translated: '' + problem.properties['translated'],
  });
  const [errorMessage, setErrorMessage] = useState('');

  interface FormValues {
    number: number;
    text: string;
    pos: string;
    lang: string;
    translated: string;
  }
  const InnerForm = (props: FormikProps<FormValues>) => {
    const { values, isSubmitting } = props;
    return (
      <Form>
        <Card>
          <Card.Content>
            <Header component="h2">Edit problem</Header>
          </Card.Content>
          <Card.Content>
            <Input
              name="text"
              label="Word"
              placeholder="english word"
              errorPrompt
            />
            <Select
              name="pos"
              label="Pos"
              options={posOptions1}
              value={values.pos}
              errorPrompt
            />
            <Select
              name="lang"
              label="Lang"
              options={langOptions}
              value={values.lang}
              errorPrompt
            />
          </Card.Content>
          <Card.Content>
            <Button
              type="submit"
              variant="true"
              color="teal"
              disabled={isSubmitting}
            >
              Update
            </Button>
          </Card.Content>
        </Card>
      </Form>
    );
  };
  interface FormProps {
    number: number;
    text: string;
    pos: string;
    lang: string;
    translated: string;
  }
  const InnerFormikForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props: FormProps) => {
      return {
        number: props.number,
        text: props.text,
        pos: props.pos,
        lang: props.lang,
        translated: props.translated,
      };
    },

    validationSchema: Yup.object().shape({
      text: Yup.string().required('Word is required'),
    }),

    handleSubmit: (
      values: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      // onsole.log('handleSubmit');
      dispatch(
        updateProblem({
          param: {
            workbookId: workbookId,
            problemId: problemId,
            number: 1,
            problemType: EnglishWordProblemTypeId,
            properties: {
              text: values.text,
              pos: values.pos,
              lang: values.lang,
            },
          },
          postSuccessProcess: () =>
            history.push(`'/app/my_workbook/'${workbookId}`),
          postFailureProcess: (error: string) => setErrorMessage(error),
        })
      );
      setValues(values);
    },
  })(InnerForm);

  return (
    <Container fluid>
      <PrivateProblemBreadcrumb
        name={props.workbook.name}
        id={+_workbookId}
        text={'' + props.problem.number}
      />
      <Divider hidden />
      <InnerFormikForm
        number={values.number}
        text={values.text}
        pos={values.pos}
        lang={values.lang}
        translated={values.translated}
      />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishWordProblemEditProps = {
  workbook: WorkbookModel;
  problem: ProblemModel;
};
