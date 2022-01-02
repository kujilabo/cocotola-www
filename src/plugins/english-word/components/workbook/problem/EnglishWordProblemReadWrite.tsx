import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Grid, Header } from 'semantic-ui-react';

import { useAppDispatch } from 'app/hooks';
import { removeProblem } from 'features/problem_remove';
import { ProblemModel } from 'models/problem';
import { DangerModal } from 'components';
import {
  POS_ADJ,
  POS_ADV,
  POS_CONJ,
  POS_DET,
  POS_MODAL,
  POS_NOUN,
  POS_PREP,
  POS_PRON,
  POS_VERB,
} from '../../../models/english-word-problem';

import 'App.css';

const toDsiplayText = (pos: number): string => {
  switch (pos) {
    case POS_ADJ:
      return '形容詞';
    case POS_ADV:
      return '副詞';
    case POS_CONJ:
      return '接続詞';
    case POS_DET:
      return '限定詞';
    case POS_MODAL:
      return '動詞';
    case POS_NOUN:
      return '名詞';
    case POS_PREP:
      return '前置詞';
    case POS_PRON:
      return '代名詞';
    case POS_VERB:
      return '動詞';
    default:
      return '';
  }
};

export const EnglishWordProblemReadWrite: React.FC<
  EnglishWordProblemReadWriteProps
> = (props: EnglishWordProblemReadWriteProps) => {
  const workbookId = props.workbookId;
  const problemId = props.problem.id;
  const problemVersion = props.problem.version;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');
  const baseUrl = `/app/private/workbook/${workbookId}/problem/${problemId}`;
  // const playAudio = (value: string) => {
  //   const audio = new Audio('data:audio/wav;base64,' + value);
  //   audio.play();
  // };
  const onRemoveButtonClick = () => {
    dispatch(
      removeProblem({
        param: {
          workbookId: workbookId,
          problemId: problemId,
          version: problemVersion,
        },
        postSuccessProcess: () => history.push(props.baseWorkbookPath),
        postFailureProcess: (error: string) => setErrorMessage(error),
      })
    );
  };

  return (
    <Card>
      <Card.Content>
        <Card.Header>{props.problem.properties['text']}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
              <Header component="h2" className="border-bottom g-mb-15">
                {toDsiplayText(props.problem.properties['pos'])}
              </Header>
            </Grid.Column>
            <Grid.Column>
              <Header component="h2" className="border-bottom g-mb-15">
                {props.problem.properties['translated']}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header component="h2" className="border-bottom g-mb-15">
                {props.problem.properties['phonetic']}
              </Header>
            </Grid.Column>
            <Grid.Column></Grid.Column>
          </Grid.Row>
        </Grid>
      </Card.Content>
      <Card.Content extra>
        {props.problem.properties['audioId'] === '0' ? (
          <Button.Group floated="left">
            <Button
              basic
              color="teal"
              onClick={() =>
                // props.getAudio(
                //   props.problem.properties['audioId'],
                //   props.problem.updatedAt,
                //   playAudio
                // )
                {
                  return;
                }
              }
            >
              Play
            </Button>
          </Button.Group>
        ) : (
          <div />
        )}
        <Button.Group floated="right">
          <Button
            basic
            color="teal"
            onClick={() => history.push(baseUrl + '/edit')}
          >
            Edit
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
        </Button.Group>
      </Card.Content>
      {errorMessage}
    </Card>
  );
};

type EnglishWordProblemReadWriteProps = {
  workbookId: number;
  problem: ProblemModel;
  baseWorkbookPath: string;
  // getAudio: (
  //   id: number,
  //   timestamp: string,
  //   postFunc: (value: string) => void
  // ) => void;
  // removeProblem: (path: string, params: RemoveProblemParameter) => void;
};
