import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik, FormikBag } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from 'app/hooks';
import { updateProblem } from 'features/problem_update';
import { EnglishWordProblemTypeId } from 'models/problem';
import {
  EnglishWordProblemEditForm,
  EnglishWordProblemEditFormValues,
} from './EnglishWordProblemEditForm';
import { TatoebaSentencePairModel } from 'plugins/tatoeba/models/tatoeba';
import { EnglishWordProblemModel } from '../../../models/english-word-problem';
import 'App.css';

export interface EnglishWordProblemEditFormikFormProps {
  number: number;
  text: string;
  pos: string;
  lang: string;
  translated: string;
  exampleSentenceText: string;
  exampleSentenceTranslated: string;
  exampleSentenceNote: string;
  tatoebaSentenceNumber1: string;
  tatoebaSentenceNumber2: string;
  tatoebaSentences: TatoebaSentencePairModel[];
}
export const englishWordProblemEditFormikForm = (
  workbookId: number,
  problem: EnglishWordProblemModel,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setProblem: (t: EnglishWordProblemEditFormValues) => void,
  selectSentence: (index: number, checked: boolean) => void
): React.ComponentType<EnglishWordProblemEditFormikFormProps> => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  return withFormik<
    EnglishWordProblemEditFormikFormProps,
    EnglishWordProblemEditFormValues
  >({
    mapPropsToValues: (props: EnglishWordProblemEditFormikFormProps) => ({
      number: props.number,
      text: props.text,
      pos: props.pos,
      lang: props.lang,
      translated: props.translated,
      exampleSentenceText: props.exampleSentenceText,
      exampleSentenceTranslated: props.exampleSentenceTranslated,
      exampleSentenceNote: props.exampleSentenceNote,
      tatoebaSentenceNumber1: props.tatoebaSentenceNumber1,
      tatoebaSentenceNumber2: props.tatoebaSentenceNumber2,
      tatoebaSentences: props.tatoebaSentences,
      selectSentence: selectSentence,
    }),
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Word is required'),
    }),
    handleSubmit: (
      values: EnglishWordProblemEditFormValues,
      formikBag: FormikBag<
        EnglishWordProblemEditFormikFormProps,
        EnglishWordProblemEditFormValues
      >
    ) => {
      // onsole.log('handleSubmit');
      dispatch(
        updateProblem({
          param: {
            workbookId: workbookId,
            problemId: problem.id,
            version: problem.version,
            number: 1,
            problemType: EnglishWordProblemTypeId,
            properties: {
              text: values.text,
              pos: values.pos,
              lang: values.lang,
              sentenceProvider: 'tatoeba',
              tatoebaSentenceNumber1: values.tatoebaSentenceNumber1,
              tatoebaSentenceNumber2: values.tatoebaSentenceNumber2,
            },
          },
          postSuccessProcess: () =>
            history.push(`/app/private/workbook/${workbookId}`),
          postFailureProcess: (error: string) => setErrorMessage(error),
        })
      );
      setProblem(values);
    },
  })(EnglishWordProblemEditForm);
};
