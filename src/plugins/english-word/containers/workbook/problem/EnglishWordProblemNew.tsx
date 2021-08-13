import React, { useState } from 'react';
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
import { selectWorkbook } from 'features/workbook_view';
import { addProblem } from 'features/problem_new';

import { AppDimmer, ErrorMessage } from 'components';
import { useDidMount } from 'components/util';
import { PrivateProblemBreadcrumb } from 'components/PrivateProblemBreadcrumb';
import { EnglishWordProblemTypeId } from 'models/problem';
import { WorkbookModel } from 'models/workbook';

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
};
export const EnglishWordProblemNew: React.FC<EnglishWordProblemNewProps> = (
  props: EnglishWordProblemNewProps
) => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const workbook = useAppSelector(selectWorkbook);
  const [values, setValues] = useState({
    text: 'pen',
    pos: '99',
    lang: 'ja',
    // continue: false,
  });
  const [errorMessage, setErrorMessage] = useState('');
  useDidMount(() => console.log('usedidmount'));

  interface OtherProps {
    loading: boolean;
  }
  interface FormValues {
    text: string;
    pos: string;
    lang: string;
  }
  const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { values, isSubmitting } = props;
    return (
      <Form>
        <Card className="full-width">
          <Card.Content>
            <Header component="h2">New problem</Header>
          </Card.Content>
          <Card.Content>
            <Input
              name="text"
              label="Word"
              placeholder="english word"
              className="full-width"
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
            {props.loading ? <AppDimmer /> : <div />}
            <Button
              type="submit"
              variant="true"
              color="teal"
              disabled={isSubmitting}
            >
              Create
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
        text: values.text,
        pos: values.pos,
        lang: values.lang,
      };
    },

    validationSchema: Yup.object().shape({
      text: Yup.string().required('Word is required'),
    }),

    handleSubmit: (
      values: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      console.log('handleSubmit');
      dispatch(
        addProblem({
          workbookId: workbookId,
          param: {
            number: 1,
            problemType: EnglishWordProblemTypeId,
            properties: {
              text: values.text,
              pos: values.pos,
              lang: values.lang,
            },
          },
          postSuccessProcess: () =>
            history.push(`/app/private/workbook/${workbookId}`),
          postFailureProcess: setErrorMessage,
        })
      );
      setValues(values);
    },
  })(InnerForm);

  return (
    <Container fluid>
      <PrivateProblemBreadcrumb
        name={workbook.name}
        id={workbookId}
        text={'New problem'}
      />
      <Divider hidden />
      <InnerFormikForm loading={false} />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishWordProblemNewProps = {
  workbook: WorkbookModel;
};
