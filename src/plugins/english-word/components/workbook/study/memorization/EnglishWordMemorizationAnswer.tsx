import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  Container,
  Divider,
  Form,
  Header,
} from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { AppBreadcrumbLink, AudioButton, ErrorMessage } from 'components';
import { selectWorkbook } from 'features/workbook_view';
import { selectProblemMap } from 'features/problem_list';
import { addRecord } from 'features/recordbook';
import { getAudio, selectAudioViewLoading } from 'features/audio';
import { emptyFunction } from 'utils/util';
import {
  selectEnglishWordRecordbook,
  nextEnglishWordProblem,
} from '../../../../features/english_word_study';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
import { toDsiplayText } from '../../../../utils/util';

import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export const EnglishWordMemorizationAnswer: React.FC<
  EnglishWordMemorizationAnswerProps
> = (props: EnglishWordMemorizationAnswerProps) => {
  const { _workbookId, _studyType } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const problemMap = useAppSelector(selectProblemMap);
  const audioViewLoading = useAppSelector(selectAudioViewLoading);
  const englishWordRecordbook = useAppSelector(selectEnglishWordRecordbook);
  const [memorized, setMemorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  if (englishWordRecordbook.records.length === 0) {
    return <div></div>;
  }
  const problemId = englishWordRecordbook.records[0].problemId;
  const problem = problemMap[problemId];

  const loadAndPlay = (postFunc: (value: string) => void) => {
    dispatch(
      getAudio({
        param: {
          id: problem.properties['audioId'],
          updatedAt: problem.updatedAt,
        },
        postFunc: postFunc,
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  };
  const onNextButtonClick = () => {
    if (memorized) {
      dispatch(
        addRecord({
          param: {
            workbookId: +_workbookId,
            studyType: _studyType,
            problemId: problemId,
            result: true,
            memorized: false,
          },
          postSuccessProcess: emptyFunction,
          postFailureProcess: setErrorMessage,
        })
      );
    }
    dispatch(nextEnglishWordProblem());
  };
  const onMemorizeButtonClick = () => setMemorized(!memorized);

  return (
    <Container fluid>
      <EnglishWordMemorizationBreadcrumb
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
        name={workbook.name}
        id={+_workbookId}
      />
      <Divider hidden />
      <Card>
        <Card.Content>
          <Header component="h2">
            {problem.properties['text']}
            <AudioButton
              loadAndPlay={loadAndPlay}
              disabled={audioViewLoading}
            />
          </Header>
        </Card.Content>
        <Card.Content>
          <p>{toDsiplayText(problem.properties['pos'])}</p>
        </Card.Content>
        <Card.Content>
          <p>{problem.properties['translated']}</p>
        </Card.Content>
        <Card.Content>
          <Form.Checkbox
            checked={memorized}
            label="完璧に覚えた"
            onClick={onMemorizeButtonClick}
          />
        </Card.Content>
        <Card.Content>
          <Button.Group fluid>
            <Button color="teal" onClick={onNextButtonClick}>
              Next
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
      <ErrorMessage message={errorMessage} />
      {englishWordRecordbook.records.map((record) => {
        return (
          <div key={record.problemId}>
            {record.problemId} : {record.level} : {record.reviewLevel}
          </div>
        );
      })}
    </Container>
  );
};

type EnglishWordMemorizationAnswerProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
