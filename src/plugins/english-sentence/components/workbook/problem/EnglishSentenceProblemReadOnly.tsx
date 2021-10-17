import React, { useState } from 'react';

import { Button, Card, Grid, Header } from 'semantic-ui-react';
import { useAppDispatch } from 'app/hooks';
import { findAudio } from 'features/audio_find';
import { ProblemModel } from 'models/problem';
import { ErrorMessage } from 'components';

import 'App.css';

export const EnglishSentenceProblemReadOnly: React.FC<EnglishSentenceProblemReadOnlyProps> = (
  props: EnglishSentenceProblemReadOnlyProps
) => {
  const dispatch = useAppDispatch();
  const problem = props.problem;
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => { return; };
  // const baseUrl =
  //   '/app/workbook/' + props.workbookId + '/problem/' + props.problem.id;
  // const playAudio = (value: string) => {
  //   const audio = new Audio('data:audio/wav;base64,' + value);
  //   audio.play();
  // };
  const onPlayButtonClick = () => {
    dispatch(findAudio({
      param: {
        id: problem.properties['audioId'],
        updatedAt: props.problem.updatedAt,
      },
      postSuccessProcess: emptyFunction,
      postFailureProcess: (error: string) => setErrorMessage,
    }));
  };

  return (
    <Card className="full-width">
      <Card.Content>
        <Card.Header>{problem.properties['text']}</Card.Header>
      </Card.Content>
      <Card.Content>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column>
            </Grid.Column>
            <Grid.Column>
              <Header component="h2" className="border-bottom g-mb-15">
                {problem.properties['translated']}
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Grid>
          <Grid.Row>
            <Grid.Column>
              <Header component="h2" className="border-bottom g-mb-15">
                {problem.properties['phonetic']}
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
            onClick={onPlayButtonClick}
          >
            Play
          </Button>
        </Button.Group>
      </Card.Content>
      <ErrorMessage message={errorMessage} />
    </Card>
  );
};

type EnglishSentenceProblemReadOnlyProps = {
  workbookId: number;
  problem: ProblemModel;
  // getAudio: (
  //   id: number,
  //   timestamp: string,
  //   postFunc: (value: string) => void
  // ) => void;
};
