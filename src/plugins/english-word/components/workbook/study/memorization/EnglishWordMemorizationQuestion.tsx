import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Divider, Header } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { AudioButton, ErrorMessage } from 'components';

import { selectWorkbook } from 'features/workbook_view';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
import {
  setEnglishWordRecordbook,
  selectTs,
  selectEnglishWordRecordbook,
} from '../../../../features/english_word_study';
import { selectRecordbook } from 'features/recordbook';
import { selectProblemMap } from 'features/problem_list';
import { getAudio, selectAudioViewLoading } from 'features/audio';
import { AppBreadcrumbLink } from 'components/AppBreadcrumb';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
};
export const EnglishWordMemorizationQuestion: React.FC<
  EnglishWordMemorizationQuestionProps
> = (props: EnglishWordMemorizationQuestionProps) => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbook = useAppSelector(selectWorkbook);
  const recordbook = useAppSelector(selectRecordbook);
  const problemMap = useAppSelector(selectProblemMap);
  const audioViewLoading = useAppSelector(selectAudioViewLoading);
  const englishWordRecordbook = useAppSelector(selectEnglishWordRecordbook);
  const ts = useAppSelector(selectTs);
  // const ts = '';
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => {
    return;
  };
  useEffect(() => {
    console.log('english word init', recordbook);
    dispatch(setEnglishWordRecordbook(recordbook));
    return;
  }, [dispatch, ts, recordbook]);

  if (englishWordRecordbook.results.length === 0) {
    return <div></div>;
  }
  const problemId = englishWordRecordbook.results[0].problemId;
  const problem = problemMap[problemId];

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

  console.log('englishWordRecordbook', englishWordRecordbook);
  console.log('problemId', problemId);
  console.log('problem', problem);
  console.log('problemMap', problemMap);
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
      <Card className="full-width">
        <Card.Content>
          <Header component="h2"></Header>
        </Card.Content>
        <Card.Content>
          <Header component="h2">{problem.properties['text']}</Header>
        </Card.Content>
        <Card.Content>
          <AudioButton loadAndPlay={loadAndPlay} disabled={audioViewLoading} />
          {/* <StandardButton onClick={() => props.selfCheck('a')} value="Check" /> */}
        </Card.Content>
      </Card>
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishWordMemorizationQuestionProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
