import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Card, Container, Divider, Header } from 'semantic-ui-react';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { Form, Input } from 'formik-semantic-ui-react';
import * as Yup from 'yup';

import {
  AppDimmer,
  AppBreadcrumb,
  DangerModal,
  ErrorMessage,
} from 'components';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  getWorkbook,
  selectWorkbook,
  selectWorkbookGetLoading,
} from 'features/workbook_get';
import {
  updateWorkbook,
  selectWorkbookUpdateLoading,
} from 'features/workbook_update';
import {
  removeWorkbook,
  selectWorkbookRemoveLoading,
} from 'features/workbook_remove';
import { WorkbookModel } from 'models/workbook';
import 'App.css';

interface OtherProps {
  loading: boolean;
  onRemoveButtonClick: () => void;
}
interface FormValues {
  id: number;
  version: number;
  name: string;
  questionText: string;
}
const InnerForm = (props: OtherProps & FormikProps<FormValues>) => {
  const { isSubmitting, loading, onRemoveButtonClick } = props;
  return (
    <Form>
      <Card className="full-width">
        <Card.Content>
          <Header component="h2">Edit workbook</Header>
        </Card.Content>
        <Card.Content>
          <Input
            name="name"
            label="Name"
            placeholder="Workbook name"
            errorPrompt
          />
          <Input
            name="questionText"
            label="Question text"
            placeholder=""
            errorPrompt
          />
        </Card.Content>
        <Card.Content>
          {loading ? <AppDimmer /> : <div />}
          <Button
            type="submit"
            variant="true"
            color="teal"
            disabled={isSubmitting}
          >
            Update
          </Button>

          <DangerModal
            triggerValue="Delete"
            content="Are you sure you want to delete this problem?"
            standardValue="Cancel"
            dangerValue="Delete"
            standardFunc={() => {
              return;
            }}
            dangerFunc={onRemoveButtonClick}
          />
        </Card.Content>
      </Card>
    </Form>
  );
};

type ParamTypes = {
  _workbookId: string;
};
export const PrivateWorkbookEdit = (): React.ReactElement => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbookId = +_workbookId;
  const history = useHistory();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const workbookGetLoading = useAppSelector(selectWorkbookGetLoading);
  const workbookUpdateLoading = useAppSelector(selectWorkbookUpdateLoading);
  const workbookRemoveLoading = useAppSelector(selectWorkbookRemoveLoading);
  const [values, setValues] = React.useState({
    version: 0,
    name: '',
    questionText: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const onRemoveButtonClick = () => {
    dispatch(
      removeWorkbook({
        param: {
          id: workbookId,
          version: values.version,
        },
        postSuccessProcess: () => history.push('/app/private/workbook'),
        postFailureProcess: (error: string) => setErrorMessage(error),
      })
    );
  };

  useEffect(() => {
    dispatch(
      getWorkbook({
        param: { id: workbookId },
        postSuccessProcess: (workbook: WorkbookModel) => {
          setValues({
            version: workbook.version,
            name: workbook.name,
            questionText: workbook.questionText,
          });
        },
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, workbookId]);

  const loading =
    workbookGetLoading ||
    workbookUpdateLoading ||
    workbookRemoveLoading ||
    +_workbookId !== workbook.id;

  interface FormProps {
    id: number;
    version: number;
    name: string;
    questionText: string;
    loading: boolean;
    onRemoveButtonClick: () => void;
  }
  const InnerFormikForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props: FormProps) => ({
      id: props.id,
      version: props.version,
      name: props.name,
      questionText: props.questionText,
    }),
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
    }),
    handleSubmit: (
      formValues: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      dispatch(
        updateWorkbook({
          param: { ...formValues },
          postSuccessProcess: (id: number) =>
            history.push(`/app/private/workbook/${workbookId}`),
          postFailureProcess: setErrorMessage,
        })
      );
      setValues(formValues);
    },
  })(InnerForm);

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[{ text: 'workbook', url: '/app/private/workbook' }]}
        text={workbookId.toString()}
      />
      <Divider hidden />
      <InnerFormikForm
        id={workbookId}
        version={values.version}
        name={values.name}
        questionText={values.questionText}
        loading={loading}
        onRemoveButtonClick={onRemoveButtonClick}
      />
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};
