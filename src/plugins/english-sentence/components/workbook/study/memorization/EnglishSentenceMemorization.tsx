import React from 'react';

import { useAppSelector } from 'app/hooks';
import { AppBreadcrumbLink, AppDimmer } from 'components';
import { EnglishSentenceMemorizationInit } from './EnglishSentenceMemorizationInit';
import { EnglishSentenceMemorizationQuestion } from './EnglishSentenceMemorizationQuestion';
import { EnglishSentenceMemorizationAnswer } from './EnglishSentenceMemorizationAnswer';
import {
  ENGLISH_SENTENCE_STATUS_INIT,
  ENGLISH_SENTENCE_STATUS_QUESTION,
  ENGLISH_SENTENCE_STATUS_ANSWER,
  selectEnglishSentenceStatus,
} from 'plugins/english-sentence/features/english_sentence_study';

import 'App.css';

export const EnglishSentenceMemorization: React.FC<
  EnglishSentenceMemorizationProps
> = (props: EnglishSentenceMemorizationProps) => {
  console.log('EnglishSentenceMemorization');
  const status = useAppSelector(selectEnglishSentenceStatus);
  if (status === ENGLISH_SENTENCE_STATUS_INIT) {
    return (
      <EnglishSentenceMemorizationInit
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
      />
    );
  } else if (status === ENGLISH_SENTENCE_STATUS_QUESTION) {
    return (
      <EnglishSentenceMemorizationQuestion
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
      />
    );
  } else if (status === ENGLISH_SENTENCE_STATUS_ANSWER) {
    return (
      <EnglishSentenceMemorizationAnswer
        breadcrumbLinks={props.breadcrumbLinks}
        workbookUrl={props.workbookUrl}
      />
    );
  } else {
    console.log('status', status);
    return <AppDimmer />;
  }
};

type EnglishSentenceMemorizationProps = {
  breadcrumbLinks: AppBreadcrumbLink[];
  workbookUrl: string;
};
