import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Grid, Header } from 'semantic-ui-react';

import { useAppDispatch } from 'app/hooks';
import { removeProblem } from 'features/problem_remove';
import { ProblemModel } from 'models/problem';
import { DangerModal } from 'components';

import 'App.css';

export const EnglishSentenceProblemReadWrite: React.FC<EnglishSentenceProblemReadWriteProps> = (
  props: EnglishSentenceProblemReadWriteProps
) => {
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
    dispatch(removeProblem({
      param: {
        workbookId: workbookId,
        problemId: problemId,
        version: problemVersion,
      },
      postSuccessProcess: () => history.push(props.baseWorkbookPath),
      postFailureProcess: (error: string) => setErrorMessage(error),
    }));
  };

  return (
    <Card className="full-width">
      <Card.Content>
        <Card.Header>{props.problem.properties['text']}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
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

type EnglishSentenceProblemReadWriteProps = {
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
