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
import {
  ProblemModel,

  EnglishWordProblemTypeId,
} from 'models/problem';

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

  interface OtherProps {
    loading: boolean;
  }
  interface FormValues {
    number: number;
    text: string;
    pos: string;
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
        pos: values.pos,
        lang: values.lang,
        translated: values.translated,
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
        updateProblem({
          workbookId: workbookId,
          problemId: problemId,
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

type EnglishWordProblemEditProps = {
  workbook: WorkbookModel;
  problem: ProblemModel;
};

/***aaa
 *
      {values.mySentences.map((e: EnglishSentenceModel) => {
        return (<Card key={e.number} fluid>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  {e.text}
                </Grid.Column>
                <Grid.Column>

                  <List bulleted horizontal>
                    <List.Item>
                      sentence <a href={'https://tatoeba.org/eng/sentences/show/' + e.properties['fromSentenceNumber']} target="_blank">#{e.properties['fromSentenceNumber']}</a>
                    </List.Item>
                    <List.Item>
                      belongs to <a href={'https://tatoeba.org/eng/user/profile/' + e.properties['fromAuthor']} target="_blank">{e.properties['fromAuthor']}</a>
                    </List.Item>
                    <List.Item>
                      license <a href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank">CC BY 2.0 FR</a>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Card.Content>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  {e.translation}
                </Grid.Column>
                <Grid.Column>

                  <List bulleted horizontal>
                    <List.Item>
                      sentence <a href={'https://tatoeba.org/eng/sentences/show/' + e.properties['toSentenceNumber']} target="_blank">#{e.properties['toSentenceNumber']}</a>
                    </List.Item>
                    <List.Item>
                      belongs to <a href={'https://tatoeba.org/eng/user/profile/' + e.properties['toAuthor']} target="_blank">{e.properties['toAuthor']}</a>
                    </List.Item>
                    <List.Item>
                      license <a href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank">CC BY 2.0 FR</a>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Card.Content>
          <Card.Content>
            <DangerButton onClick={onRemoveSentenceButtonClick} value="Remove" />
          </Card.Content>
        </Card>)
      })}
 */
/***
 *bbb
      {values.sentences.map((e: EnglishSentenceModel) => {
        return <Card key={e.number} fluid>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  {e.text}
                </Grid.Column>
                <Grid.Column>

                  <List bulleted horizontal>
                    <List.Item>
                      sentence <a href={'https://tatoeba.org/eng/sentences/show/' + e.properties['fromSentenceNumber']} target="_blank">#{e.properties['fromSentenceNumber']}</a>
                    </List.Item>
                    <List.Item>
                      belongs to <a href={'https://tatoeba.org/eng/user/profile/' + e.properties['fromAuthor']} target="_blank">{e.properties['fromAuthor']}</a>
                    </List.Item>
                    <List.Item>
                      license <a href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank">CC BY 2.0 FR</a>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Card.Content>
          <Card.Content>
            <Grid columns={2}>
              <Grid.Row>
                <Grid.Column>
                  {e.translation}
                </Grid.Column>
                <Grid.Column>

                  <List bulleted horizontal>
                    <List.Item>
                      sentence <a href={'https://tatoeba.org/eng/sentences/show/' + e.properties['toSentenceNumber']} target="_blank">#{e.properties['toSentenceNumber']}</a>
                    </List.Item>
                    <List.Item>
                      belongs to <a href={'https://tatoeba.org/eng/user/profile/' + e.properties['toAuthor']} target="_blank">{e.properties['toAuthor']}</a>
                    </List.Item>
                    <List.Item>
                      license <a href="https://creativecommons.org/licenses/by/2.0/fr/" target="_blank">CC BY 2.0 FR</a>
                    </List.Item>
                  </List>
                </Grid.Column>
              </Grid.Row>
            </Grid>

          </Card.Content>
          <Card.Content>
            <StandardButton onClick={() => onAddSentenceButtonClick(e)} value="Add" />
          </Card.Content>
        </Card>
      })}
 */
