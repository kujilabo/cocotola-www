import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { AppBreadcrumbLink } from 'components';
import { selectWorkbook } from 'features/workbook_get';
import { selectRecordbook } from 'features/recordbook_get';
import { selectProblemMap } from 'features/problem_find';
import { EnglishSentenceMemorizationBreadcrumb } from './EnglishSentenceMemorizationBreadcrumb';
import {
  setEnglishSentenceRecordbook,
  selectTs,
  selectEnglishSentenceRecordbook,
} from '../../../../features/english_sentence_study';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export const EnglishSentenceMemorizationInit: React.FC<
  EnglishSentenceMemorizationInitProps
> = (props: EnglishSentenceMemorizationInitProps) => {
  const { _workbookId } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const recordbook = useAppSelector(selectRecordbook);
  const problemMap = useAppSelector(selectProblemMap);
  const englishSentenceRecordbook = useAppSelector(
    selectEnglishSentenceRecordbook
  );
  const ts = useAppSelector(selectTs);

  console.log('EnglishSentenceMemorizationInit');
  useEffect(() => {
    dispatch(setEnglishSentenceRecordbook(recordbook));
  }, [dispatch, ts, recordbook]);

  if (englishSentenceRecordbook.records.length === 0) {
    return <div />;
  }
  const problemId = englishSentenceRecordbook.records[0].problemId;
  const problem = problemMap[problemId];
  // onsole.log('englishSentenceRecordbook.records', englishSentenceRecordbook.records);
  // onsole.log('problemMap', problemMap);
  // onsole.log('problemId', problemId);
  // onsole.log('problem', problem);

  if (!problem) {
    return <div>undefined</div>;
  }
  return (
    <Container fluid>
      <EnglishSentenceMemorizationBreadcrumb
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
        name={workbook.name}
        id={+_workbookId}
      />
    </Container>
  );
};

type EnglishSentenceMemorizationInitProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
