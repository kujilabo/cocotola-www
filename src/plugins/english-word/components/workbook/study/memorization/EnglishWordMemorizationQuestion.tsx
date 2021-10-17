import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, Container, Divider, Header } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  AudioButton,
  ErrorMessage,
} from 'components';

import { selectWorkbook } from 'features/workbook_view';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
// import {
//   // setProblemIds,
//   selectTs,
//   // selectEnglishWordProblemWithLevelList,
// } from 'plugins/english-word/features/english_word_study';
import { selectProblemWithLevelList, setStudyResult } from 'features/study_problem_ids';
import { selectProblemMap } from 'features/problem_list';
import { findAudio } from 'features/audio_find';
import { AppBreadcrumbLink } from 'components/AppBreadcrumb';
import 'App.css';
import { useTranslation } from 'react-i18next';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export const EnglishWordMemorizationQuestion: React.FC<EnglishWordMemorizationQuestionProps> = (
  props: EnglishWordMemorizationQuestionProps
) => {
  const { _workbookId, _studyType } = useParams<ParamTypes>();
  const workbook = useAppSelector(selectWorkbook);
  const problemWithLevelList = useAppSelector(selectProblemWithLevelList);
  const problemMap = useAppSelector(selectProblemMap);
  // const englishWordProblemWithLevelList = useAppSelector(selectEnglishWordProblemWithLevelList);
  // const ts = useAppSelector(selectTs);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [t] = useTranslation();
  // const [lang, setLang] = useState('ja');
  const emptyFunction = () => { return; };
  // useEffect(() => {
  //   console.log('english word init', problemWithLevelList);
  //   dispatch(setProblemIds(problemWithLevelList));
  //   return;
  // }, [dispatch, ts, problemWithLevelList]);
  // useEffect(() => {
  //   i18n.changeLanguage(lang);
  // }, [lang, i18n]);

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
  const onWrongButtonClick = (problemId: number) => {
    dispatch(setStudyResult({
      workbookId: +_workbookId,
      studyType: _studyType,
      problemId: problemId,
      param: { result: true },
      postSuccessProcess: emptyFunction,
      postFailureProcess: setErrorMessage,
    }))
  }
  const onCorrectButtonClick = () => { }

  console.log('problemWithLevelList', problemWithLevelList);
  console.log('problemId', problemId);
  console.log('problem', problem);
  console.log('problemMap', problemMap);
  if (!problem) {
    return (<div>undefined</div>);
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

        <Card.Content extra>
          <div className='ui two buttons'>
            <Button basic color='grey' onClick={() => onWrongButtonClick(problemId)}>
              {t('p_ew__i_dont_know')}
            </Button>
            <Button basic color='green' onClick={onCorrectButtonClick}>
              {t('p_ew__i_know')}
            </Button>
          </div>
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
