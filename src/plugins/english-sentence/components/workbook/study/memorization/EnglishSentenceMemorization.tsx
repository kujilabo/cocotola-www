import React from 'react';

// import EnglishSentenceMemorizationInit from './EnglishSentenceMemorizationInit';
import { EnglishSentenceMemorizationQuestion } from './EnglishSentenceMemorizationQuestion';
// import EnglishSentenceMemorizationAnswer from './EnglishSentenceMemorizationAnswer';
// import EnglishSentenceMemorizationResult from './EnglishSentenceMemorizationResult';
// import {
//   StatusInit,
//   StatusQuestion,
//   StatusAnswer,
//   StatusResult,
// } from 'reducers/study';
import { useAppSelector } from 'app/hooks';
import { selectEnglishSentenceStatus } from 'plugins/english-sentence/features/english_sentence_study';
import { AppBreadcrumbLink } from 'components/AppBreadcrumb';
import 'App.css';

export const EnglishSentenceMemorization: React.FC<EnglishSentenceMemorizationProps> = (
  props: EnglishSentenceMemorizationProps
) => {
  const status = useAppSelector(selectEnglishSentenceStatus);
  console.log('status', status);
  return <EnglishSentenceMemorizationQuestion breadcrumbLinks={props.breadcrumbLinks} workbookUrl={props.workbookUrl} />;
  // if (status === StatusInit) {
  //   // return <EnglishSentenceMemorizationInit />;
  //   // } else if (props.status === StatusQuestion) {
  //   return <EnglishSentenceMemorizationQuestion breadcrumbLinks={props.breadcrumbLinks} workbookUrl={props.workbookUrl} />;
  //   // } else if (props.status === StatusAnswer) {
  //   //   return <EnglishSentenceMemorizationAnswer />;
  //   // } else if (props.status === StatusResult) {
  //   //   return <EnglishSentenceMemorizationResult />;
  //   // } else {
  //   //   return <div>else</div>;
  //   // }
  // }
  // return <div>else</div>;
};

type EnglishSentenceMemorizationProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
}
