import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { AppBreadcrumbLink } from 'components';
import { selectWorkbook } from 'features/workbook_view';
import { selectRecordbook } from 'features/recordbook';
import { selectProblemMap } from 'features/problem_list';
import { EnglishWordMemorizationBreadcrumb } from './EnglishWordMemorizationBreadcrumb';
import {
  setEnglishWordRecordbook,
  selectTs,
  selectEnglishWordRecordbook,
} from '../../../../features/english_word_study';
import 'App.css';

type ParamTypes = {
  _workbookId: string;
  _studyType: string;
};
export const EnglishWordMemorizationInit: React.FC<
  EnglishWordMemorizationInitProps
> = (props: EnglishWordMemorizationInitProps) => {
  const { _workbookId } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const workbook = useAppSelector(selectWorkbook);
  const recordbook = useAppSelector(selectRecordbook);
  const problemMap = useAppSelector(selectProblemMap);
  const englishWordRecordbook = useAppSelector(selectEnglishWordRecordbook);
  const ts = useAppSelector(selectTs);

  useEffect(() => {
    dispatch(setEnglishWordRecordbook(recordbook));
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
    </Container>
  );
};

type EnglishWordMemorizationInitProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
