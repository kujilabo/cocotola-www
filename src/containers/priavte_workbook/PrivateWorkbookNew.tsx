import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Container, Divider, Header } from 'semantic-ui-react';
import {
  withFormik,
  FormikBag,
  FormikProps,
} from 'formik';
import { Form, Input, Select } from 'formik-semantic-ui-react';
import * as Yup from 'yup';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  addWorkbook,
  selectWorkbookNewLoading,
} from 'features/workbook_new';
import { AppDimmer, AppBreadcrumb, ErrorMessage } from 'components';
import 'App.css';

const problemTypeOptions = [
  { key: 'word', text: '単語', value: 'english_word' },
  { key: 'phrase', text: '文章', value: 'english_phrase' },
  { key: 'template', text: 'テンプレート', value: 'template' },
];

export function PrivateWorkbookNew() {
  const dispatch = useAppDispatch();
  const workbookNewLoading = useAppSelector(selectWorkbookNewLoading);
  const history = useHistory();
  const [values, setValues] = React.useState({
    name: '',
    questionText: '',
    problemType: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  interface OtherProps {
    loading: boolean;
  }
  interface FormValues {
    name: string;
    questionText: string;
    problemType: string;
  }
  const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
    const { isSubmitting } = props;
    return (
      <Form>
        <Card className="full-width">
          <Card.Content>
            <Header component="h2">New workbook</Header>
          </Card.Content>
          <Card.Content>
            <Input
              name="name"
              label="Name"
              placeholder="Workbook name"
              className="full-width"
              errorPrompt
            />
            <Input
              name="questionText"
              label="Question text"
              placeholder=""
              className="full-width"
              errorPrompt
            />
            <Select
              name="problemType"
              options={problemTypeOptions}
              label="Problem type"
              // value={values.problemType}
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
    mapPropsToValues: (props: FormProps) => ({
      name: values.name,
      questionText: values.questionText,
      problemType: values.problemType,
    }),
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      problemType: Yup.string().required('Problem type is required'),
    }),
    handleSubmit: (
      values: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      dispatch(
        addWorkbook({
          param: { ...values, spaceKey: 'personal' },
          postSuccessProcess: (id: number) => history.push('/app/private/workbook'),
          postFailureProcess: setErrorMessage,
        })
      );
      setValues(values);
    },
  })(InnerForm);

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[{ text: 'workbook', url: '/app/private/workbook' }]}
        text={'New workbook'}
      />
      <Divider hidden />
      <InnerFormikForm loading={workbookNewLoading} />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
}