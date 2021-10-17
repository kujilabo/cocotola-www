import React, { useState, } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Card, Container, Divider, Header } from 'semantic-ui-react';
import {
  withFormik,
  // Form as FormikForm,
  // Field as FormikField,
  FormikBag,
  FormikProps,
} from 'formik';
import { Form, Input, Select } from 'formik-semantic-ui-react';
import * as Yup from 'yup';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  AppDimmer,

  ErrorMessage,

  PrivateProblemBreadcrumb,
} from 'components';

import { updateProblem } from 'features/problem_edit';
import {

  selectProblem,
} from 'features/problem_view';

import { WorkbookModel } from 'models/workbook';
import { ProblemModel } from 'models/problem'
import { EnglishSentenceProblemTypeId } from '../../../models/english_sentence_problem';

import 'App.css';

const langOptions = [{ key: 'ja', text: 'ja', value: 'ja' }];

type ParamTypes = {
  _workbookId: string;
  _problemId: string;
};
export const EnglishSentenceProblemEdit: React.FC<EnglishSentenceProblemEditProps> = (
  props: EnglishSentenceProblemEditProps
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
    lang: '' + problem.properties['lang'],
    translated: '' + problem.properties['translated'],
  });
  const [errorMessage, setErrorMessage] = useState('');

  interface OtherProps {
    loading: boolean;
  }
  interface FormValues {
    number: number;
    text: string;
    lang: string;
    translated: string;
  }
  const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { values, isSubmitting } = props;
    return (
      <Form>
        <Card className="full-width">
          <Card.Content>
            <Header component="h2">Edit problem</Header>
          </Card.Content>
          <Card.Content>
            <Input
              name="text"
              label="Sentence"
              placeholder="english word"
              className="full-width"
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
            {props.loading ? <AppDimmer /> : <div />}
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
    loading: boolean;
  }
  const InnerFormikForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props: FormProps) => {
      return {
        number: values.number,
        text: values.text,
        lang: values.lang,
        translated: values.translated,
      };
    },

    validationSchema: Yup.object().shape({
      text: Yup.string().required('Sentence is required'),
    }),

    handleSubmit: (
      values: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      console.log('handleSubmit');
      dispatch(
        updateProblem({
          workbookId: workbookId,
          problemId: problemId,
          param: {
            number: 1,
            problemType: EnglishSentenceProblemTypeId,
            properties: {
              text: values.text,
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
      <InnerFormikForm loading={false} />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishSentenceProblemEditProps = {
  workbook: WorkbookModel;
  problem: ProblemModel;
};
