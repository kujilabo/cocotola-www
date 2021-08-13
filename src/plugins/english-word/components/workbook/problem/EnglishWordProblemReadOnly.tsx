import React from 'react';

import { Button, Card, Grid, Header } from 'semantic-ui-react';
import { ProblemModel } from 'models/problem';
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

export const EnglishWordProblemReadOnly: React.FC<EnglishWordProblemReadOnlyProps> = (
  props: EnglishWordProblemReadOnlyProps
) => {
  // const history = useHistory();
  // const baseUrl =
  //   '/app/workbook/' + props.workbookId + '/problem/' + props.problem.id;
  // const playAudio = (value: string) => {
  //   const audio = new Audio('data:audio/wav;base64,' + value);
  //   audio.play();
  // };

  return (
    <Card className="full-width">
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
