import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  Button,
  Card,
  Container,
  Divider,
  // Form,
  Header,
  Icon,
} from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { AppBreadcrumbLink, AudioButton, ErrorMessage } from 'components';
import { selectWorkbook } from 'features/workbook_view';
import { addRecord } from 'features/recordbook';
import { selectRecordbook } from 'features/recordbook';
import { selectProblemMap } from 'features/problem_list';
import { getAudio, selectAudioViewLoading } from 'features/audio';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
import {
  setEnglishWordRecordbook,
  selectTs,
  selectEnglishWordStatus,
  selectEnglishWordRecordbook,
  setEnglishWordStatus,
  setEnglishWordRecord,
  ENGLISH_WORD_STATUS_ANSWER,
  ENGLISH_WORD_STATUS_INIT,
} from '../../../../features/english_word_study';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export const EnglishWordMemorizationQuestion: React.FC<
  EnglishWordMemorizationQuestionProps
> = (props: EnglishWordMemorizationQuestionProps) => {
  const { _workbookId, _studyType } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const status = useAppSelector(selectEnglishWordStatus);
  const recordbook = useAppSelector(selectRecordbook);
  const problemMap = useAppSelector(selectProblemMap);
  const audioViewLoading = useAppSelector(selectAudioViewLoading);
  const englishWordRecordbook = useAppSelector(selectEnglishWordRecordbook);
  const ts = useAppSelector(selectTs);
  const [answerOpen, setAnswerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const [memorized, setMemorized] = useState(false);
  const emptyFunction = () => {
    return;
  };
  useEffect(() => {
    if (status === ENGLISH_WORD_STATUS_INIT) {
      console.log('english word init', recordbook);
      dispatch(setEnglishWordRecordbook(recordbook));
    }
  }, [dispatch, ts, recordbook]);

  if (englishWordRecordbook.records.length === 0) {
    return <div></div>;
  }
  const problemId = englishWordRecordbook.records[0].problemId;
  const problem = problemMap[problemId];
  console.log('englishWordRecordbook.records', englishWordRecordbook.records);
  console.log('problemMap', problemMap);
  console.log('problemId', problemId);
  console.log('problem', problem);

  // const playAudio = (value: string) => {
  //   const audio = new Audio('data:audio/wav;base64,' + value);
  //   audio.play();
  // };
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

  const setRecord = (result: boolean) => {
    dispatch(
      addRecord({
        param: {
          workbookId: +_workbookId,
          studyType: _studyType,
          problemId: problemId,
          result: result,
          memorized: false,
        },
        postSuccessProcess: () => {
          dispatch(setEnglishWordRecord(result));
          dispatch(setEnglishWordStatus(ENGLISH_WORD_STATUS_ANSWER));
        },
        postFailureProcess: setErrorMessage,
      })
    );
  };
  const onYesButtonClick = () => setRecord(true);
  const onNoButtonClick = () => setRecord(false);
  // const onMemorizeButtonClick = () => setMemorized(!memorized);

  // console.log('englishWordRecordbook', englishWordRecordbook);
  // console.log('problemId', problemId);
  // console.log('problem', problem);
  // console.log('problemMap', problemMap);
  if (!problem) {
    return <div>undefined</div>;
  }
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
        {/* <Card.Content>
          <Form.Checkbox
            checked={memorized}
            label="完璧に覚えた"
            onClick={onMemorizeButtonClick}
          />
        </Card.Content> */}
        <Card.Content>
          <Button.Group fluid>
            <Button onClick={onNoButtonClick}>No</Button>
            <Button.Or />
            <Button positive onClick={onYesButtonClick}>
              Yes
            </Button>
          </Button.Group>
        </Card.Content>

        <Card.Content>
          <Accordion>
            <Accordion.Title
              active={answerOpen}
              index={0}
              onClick={() => setAnswerOpen(!answerOpen)}
            >
              <Icon name="dropdown" />
              Answer
            </Accordion.Title>
            <Accordion.Content active={answerOpen}>
              <p>{problem.properties['translated']}</p>
            </Accordion.Content>
          </Accordion>
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

type EnglishWordMemorizationQuestionProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
