import React, { useEffect, useState } from 'react';
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
import { LinkButton } from 'components/buttons';
import { selectWorkbook } from 'features/workbook_get';
import { selectProblemMap } from 'features/problem_find';
import { addRecord } from 'features/record_add';
import { getAudio, selectAudioViewLoading } from 'features/audio';
import { getProblem } from 'features/problem_get';
import { ProblemModel } from 'models/problem';
import { emptyFunction } from 'utils/util';
import {
  selectEnglishWordRecordbook,
  nextEnglishWordProblem,
} from '../../../../features/english_word_study';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
import { EnglishWordProblemModel } from '../../../../models/english-word-problem';
// import { TatoebaSentenceModel } from 'plugins/tatoeba/models/tatoeba';
import { toDsiplayText } from '../../../../utils/util';

import 'App.css';

// const emptyTatoebaSentence: TatoebaSentenceModel = {
//   text: '',
//   author: '',
//   sentenceNumber: 0,
//   lang: '',
// };
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
  const problem = EnglishWordProblemModel.of(problemMap[problemId]);
  const baseUrl = `/app/private/workbook/${_workbookId}/problem/${problemId}`;
  console.log('problem', problem);
  // let sentence1 = emptyTatoebaSentence;
  // let sentence2 = emptyTatoebaSentence;
  // if (problem.senexampleSentenceNote && values.exampleSentenceNote !== '') {
  //   try {
  //     const noteObj = JSON.parse(values.exampleSentenceNote);
  //     console.log('noteObj', noteObj);
  //     sentence1 = {
  //       text: values.exampleSentenceText,
  //       author: noteObj['tatoebaAuthor1'],
  //       sentenceNumber: +noteObj['tatoebaSentenceNumber1'],
  //       lang: 'en',
  //     };
  //     sentence2 = {
  //       text: values.exampleSentenceTranslated,
  //       author: noteObj['tatoebaAuthor2'],
  //       sentenceNumber: +noteObj['tatoebaSentenceNumber2'],
  //       lang: 'ja',
  //     };
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }
  useEffect(() => {
    dispatch(
      getProblem({
        param: { workbookId: +_workbookId, problemId: problemId },
        postSuccessProcess: (p: ProblemModel) => {
          const e = EnglishWordProblemModel.of(p);
          console.log(e);
        },
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _workbookId, problemId, problem.version]);

  const loadAndPlay = (postFunc: (value: string) => void) => {
    dispatch(
      getAudio({
        param: {
          workbookId: +_workbookId,
          problemId: problemId,
          id: +problem.audioId,
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
            memorized: true,
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
            {problem.text}
            <AudioButton
              id={+problem.audioId}
              loadAndPlay={loadAndPlay}
              disabled={audioViewLoading}
            />
          </Header>
        </Card.Content>
        <Card.Content>
          <p>{toDsiplayText(+problem.pos)}</p>
        </Card.Content>
        <Card.Content>
          <p>{problem.translated}</p>
        </Card.Content>
        <Card.Content>
          <Button.Group fluid>
            <LinkButton to={`${baseUrl}/edit`} value={'Edit'} />
          </Button.Group>
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
