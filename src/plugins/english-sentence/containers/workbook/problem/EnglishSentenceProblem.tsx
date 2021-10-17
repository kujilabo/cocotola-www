import React from 'react';
import {
  ActionCreatorWithPayload,
  Reducer,
} from '@reduxjs/toolkit';

import { CustomProblem } from 'containers/workbook/problem/CustomProblem';
import { ProblemModel } from 'models/problem';
import { WorkbookModel } from 'models/workbook';
import { EnglishSentenceProblemNew } from './EnglishSentenceProblemNew';
import { EnglishSentenceProblemEdit } from './EnglishSentenceProblemEdit';
import { EnglishSentenceProblemMenu } from './EnglishSentenceProblemMenu';

import { EnglishSentenceProblemReadOnly } from '../../../components/workbook/problem/EnglishSentenceProblemReadOnly';
import { EnglishSentenceProblemReadWrite } from '../../../components/workbook/problem/EnglishSentenceProblemReadWrite';
import { EnglishSentenceMemorization } from '../../../components/workbook/study/memorization/EnglishSentenceMemorization';
// import EnglishSentenceDictation from '../../../components/workbook/study/dictation/EnglishSentenceDictation';
import {
  englishSentenceSlice,
  initEnglishSentenceStatus,
} from '../../../features/english_sentence_study';

export class EnglishSentenceProblem extends CustomProblem {
  getName(): string {
    return 'english_sentence';
  }

  getReducer(): Reducer {
    return englishSentenceSlice.reducer;
  }

  createMenu(
    init: (s: string) => void,
    workbook: WorkbookModel
  ): React.ReactElement {
    return <EnglishSentenceProblemMenu initStudy={init} workbook={workbook} />;
  }

  createReadOnlyProblem(
    id: number,
    workbookId: number,
    problem: ProblemModel
  ): React.ReactElement {
    return (
      <EnglishSentenceProblemReadOnly
        key={id}
        workbookId={workbookId}
        problem={problem}
      />
    );
  }

  createReadWriteProblem(
    id: number,
    workbookId: number,
    problem: ProblemModel
  ): React.ReactElement {
    return (
      <EnglishSentenceProblemReadWrite
        key={id}
        workbookId={workbookId}
        problem={problem}
        baseWorkbookPath={`/app/private/workbook/${workbookId}`}
      />
    );
  }

  createProblemNew(workbook: WorkbookModel): React.ReactElement {
    return <EnglishSentenceProblemNew workbook={workbook} />;
  }

  createProblemEdit(
    workbook: WorkbookModel,
    problem: ProblemModel
  ): React.ReactElement {
    return <EnglishSentenceProblemEdit workbook={workbook} problem={problem} />;
  }

  createProblemStudy(studyType: string): React.ReactElement {
    if (studyType === 'memorization') {
      return <EnglishSentenceMemorization breadcrumbLinks={
        [
          { url: '/app/private/workbook', text: 'My Workbooks' },
        ]
      } workbookUrl={'/app/private/workbook/'} />;
    } else {
      // return <EnglishSentenceDictation />;
      return <div>xxx</div>;
    }
  }

  // createBreadcrumbs(studyType: string): React.ReactElement {
  //   if (studyType == 'memorization') {

  //   } else {

  //   }
  // }

  initProblemStudy(): ActionCreatorWithPayload<string> {
    console.log('eng initProblemStudy');
    return initEnglishSentenceStatus;
  }
}
