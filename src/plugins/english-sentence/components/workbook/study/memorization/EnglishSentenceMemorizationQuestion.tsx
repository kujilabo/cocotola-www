import React, {
  // useEffect,
  useState
} from 'react';
import { useParams } from 'react-router-dom';
import { Card, Container, Divider, Header } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  AudioButton,
  ErrorMessage,
} from 'components';

import { selectWorkbook } from 'features/workbook_view';
import { EnglishSentenceMemorizationBreadcrumb } from './EnglishSentenceMemorizationBreadcrumb';
// import {
//   // setProblemWithLevelList,
//   // selectTs,
//   // selectEnglishSentenceProblemIds,
// } from '../../../../features/english_sentence_study';
import { selectProblemWithLevelList } from 'features/study_problem_ids';
import { selectProblemMap } from 'features/problem_list';
import { findAudio } from 'features/audio_find';
import { AppBreadcrumbLink } from 'components/AppBreadcrumb';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
};
export const EnglishSentenceMemorizationQuestion: React.FC<EnglishSentenceMemorizationQuestionProps> = (
  props: EnglishSentenceMemorizationQuestionProps
) => {
  const { _workbookId } = useParams<ParamTypes>();
  const workbook = useAppSelector(selectWorkbook);
  const problemWithLevelList = useAppSelector(selectProblemWithLevelList);
  const problemMap = useAppSelector(selectProblemMap);
  // const englishSentenceProblemIds = useAppSelector(selectEnglishSentenceProblemIds);
  // const ts = useAppSelector(selectTs);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const emptyFunction = () => { return; };
  // useEffect(() => {
  //   console.log('english word init', problemWithLevelList);
  //   dispatch(setProblemWithLevelList(problemWithLevelList));
  //   return;
  // }, [dispatch, ts, problemWithLevelList]);

  if (problemWithLevelList.length === 0) {
    return (<div></div>);
  }
  const problemId = problemWithLevelList[0].problemId;
  const problem = problemMap[problemId];
  const loadAndPlay = (postFunc: (value: string) => void) => {
    dispatch(findAudio({
      param: {
        id: problem.properties['audioId'],
        updatedAt: problem.updatedAt,
      },
      postSuccessProcess: emptyFunction,
      postFailureProcess: setErrorMessage
    }));
  };

  // console.log('englishSentenceProblemIds', englishSentenceProblemIds);
  console.log('problemId', problemId);
  console.log('problem', problem);
  console.log('problemMap', problemMap);
  if (!problem) {
    return (<div>undefined</div>);
  }
  return (
    <Container fluid>
      <EnglishSentenceMemorizationBreadcrumb
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
        name={workbook.name}
        id={+_workbookId}
      />
      <Divider hidden />
      <Card className="full-width">
        <Card.Content>
          <Header component="h2">
          </Header>
        </Card.Content>
        <Card.Content>
          <Header component="h2">{problem.properties['text']}</Header>
        </Card.Content>
        <Card.Content>
          <AudioButton loadAndPlay={loadAndPlay} />
          <AudioButton loadAndPlay={loadAndPlay} />
          {/* <StandardButton onClick={() => props.selfCheck('a')} value="Check" /> */}
        </Card.Content>
      </Card>
      <ErrorMessage message={errorMessage} />
    </Container>
  );
};

type EnglishSentenceMemorizationQuestionProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
