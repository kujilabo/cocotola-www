import React from 'react';

// import EnglishWordMemorizationInit from './EnglishWordMemorizationInit';
import { EnglishWordMemorizationQuestion } from './EnglishWordMemorizationQuestion';
// import EnglishWordMemorizationAnswer from './EnglishWordMemorizationAnswer';
// import EnglishWordMemorizationResult from './EnglishWordMemorizationResult';
// import {
//   StatusInit,
//   StatusQuestion,
//   StatusAnswer,
//   StatusResult,
// } from 'reducers/study';
import { useAppSelector } from 'app/hooks';
import { selectEnglishWordStatus } from 'plugins/english-word/features/english_word_study';
import { AppBreadcrumbLink } from 'components/AppBreadcrumb';
import 'App.css';

export const EnglishWordMemorization: React.FC<EnglishWordMemorizationProps> = (
  props: EnglishWordMemorizationProps
) => {
  const status = useAppSelector(selectEnglishWordStatus);
  console.log('status', status);
  return <EnglishWordMemorizationQuestion breadcrumbLinks={props.breadcrumbLinks} workbookUrl={props.workbookUrl} />;
  // if (status === StatusInit) {
  //   // return <EnglishWordMemorizationInit />;
  //   // } else if (props.status === StatusQuestion) {
  //   return <EnglishWordMemorizationQuestion breadcrumbLinks={props.breadcrumbLinks} workbookUrl={props.workbookUrl} />;
  //   // } else if (props.status === StatusAnswer) {
  //   //   return <EnglishWordMemorizationAnswer />;
  //   // } else if (props.status === StatusResult) {
  //   //   return <EnglishWordMemorizationResult />;
  //   // } else {
  //   //   return <div>else</div>;
  //   // }
  // }
  // return <div>else</div>;
};

type EnglishWordMemorizationProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
}
