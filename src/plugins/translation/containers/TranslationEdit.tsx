import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Header,
} from 'semantic-ui-react';
import { withFormik, FormikBag, FormikProps } from 'formik';
import { Form, Input } from 'formik-semantic-ui-react';
import * as Yup from 'yup';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  selectTranslationUpdateLoading,
  updateTranslation,
} from '../features/translation_update';
import {
  selectTranslationGetLoading,
  selectTranslation,
  getTranslation,
} from '../features/translation_get';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { emptyFunction } from 'utils/util';
import 'App.css';

interface FormValues {
  text: string;
  translated: string;
}
const InnerForm = (props: FormikProps<FormValues>) => {
  const { isSubmitting } = props;
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
          <Input
            name="translated"
            label="Word"
            placeholder="translated"
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

type ParamTypes = {
  _text: string;
  _pos: string;
};

export const TranslationEdit = (): React.ReactElement => {
  const { _text, _pos } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const translationGetLoading = useAppSelector(selectTranslationGetLoading);
  const translationUpdateLoading = useAppSelector(
    selectTranslationUpdateLoading
  );
  const loading = translationGetLoading || translationUpdateLoading;
  const translation = useAppSelector(selectTranslation);
  // const [values, setValues] = useState({
  //   text: '' + translation.text,
  //   translated: '' + translation.translated,
  // });
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    dispatch(
      getTranslation({
        param: {
          text: _text,
          pos: +_pos,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _text, _pos]);

  if (loading) {
    return <AppDimmer />;
  }

  interface FormProps {
    text: string;
    translated: string;
  }
  const InnerFormikForm = withFormik<FormProps, FormValues>({
    mapPropsToValues: (props: FormProps) => ({
      text: props.text,
      translated: props.translated,
    }),
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Word is required'),
    }),
    handleSubmit: (
      formValues: FormValues,
      formikBag: FormikBag<FormProps, FormValues>
    ) => {
      // onsole.log('handleSubmit');
      dispatch(
        updateTranslation({
          param: {
            version: translation.version,
            text: formValues.text,
            pos: translation.pos,
            translated: formValues.translated,
            lang: translation.lang,
          },
          postSuccessProcess: () => history.push(`'/plugin/translation/list`),
          postFailureProcess: (error: string) => setErrorMessage(error),
        })
      );
    },
  })(InnerForm);
  return (
    <Container fluid>
      <AppBreadcrumb links={[]} text={'Translations'} />
      <Divider hidden />
      <Grid>
        <Grid.Row>
          {loading ? <AppDimmer /> : <div />}
          <Grid.Column mobile={16} tablet={16} computer={3}></Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <Grid doubling columns={3}>
              <InnerFormikForm
                text={translation.text}
                translated={translation.translated}
              />
            </Grid>
            <ErrorMessage message={errorMessage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
