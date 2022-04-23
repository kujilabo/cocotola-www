import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Card, Grid, Header } from 'semantic-ui-react';

import { useAppDispatch } from 'app/hooks';
import { removeProblem } from 'features/problem_remove';
import { ProblemModel } from 'models/problem';
import { LinkButton } from 'components/buttons';
import { DangerModal } from 'components';
import { toDsiplayText } from '../../../utils/util';
import 'App.css';

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
  const onRemoveButtonClick = () => {
    dispatch(
      removeProblem({
        param: {
          workbookId: workbookId,
          problemId: problemId,
          version: problemVersion,
        },
        postSuccessProcess: () => history.push(props.baseWorkbookPath),
        postFailureProcess: setErrorMessage,
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
        <Button.Group floated="left">
          <LinkButton to={`${baseUrl}/edit`} value={'Edit'} />
        </Button.Group>
        <Button.Group floated="right">
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
