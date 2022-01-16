import React from 'react';

import { Button, Card, Grid, Header } from 'semantic-ui-react';
import { ProblemModel } from 'models/problem';
import { toDsiplayText } from '../../../utils/util';
import 'App.css';

export const EnglishWordProblemReadOnly: React.FC<
  EnglishWordProblemReadOnlyProps
> = (props: EnglishWordProblemReadOnlyProps) => {
  // const history = useHistory();
  // const baseUrl =
  //   '/app/workbook/' + props.workbookId + '/problem/' + props.problem.id;
  // const playAudio = (value: string) => {
  //   const audio = new Audio('data:audio/wav;base64,' + value);
  //   audio.play();
  // };

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
        <Button.Group floated="left">
          <Button
            basic
            color="teal"
            // onClick={() =>
            //   props.getAudio(
            //     props.problem.properties['audioId'],
            //     props.problem.updatedAt,
            //     playAudio
            //   )
            // }
          >
            Play
          </Button>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

type EnglishWordProblemReadOnlyProps = {
  workbookId: number;
  problem: ProblemModel;
  // getAudio: (
  //   id: number,
  //   timestamp: string,
  //   postFunc: (value: string) => void
  // ) => void;
};
