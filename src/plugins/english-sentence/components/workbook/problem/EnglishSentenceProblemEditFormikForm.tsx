import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik, FormikBag } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from 'app/hooks';
import { updateProblem } from 'features/problem_update';
import { EnglishSentenceProblemTypeId } from 'models/problem';
import {
  EnglishSentenceProblemEditForm,
  EnglishSentenceProblemEditFormValues,
} from './EnglishSentenceProblemEditForm';
import { EnglishSentenceProblemModel } from '../../../models/english-sentence-problem';
import 'App.css';

export interface EnglishSentenceProblemEditFormikFormProps {
  number: number;
  text: string;
  lang2: string;
  translated: string;
  // note: string;
}
export const englishSentenceProblemEditFormikForm = (
  workbookId: number,
  problem: EnglishSentenceProblemModel,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setProblem: (t: EnglishSentenceProblemEditFormValues) => void
): React.ComponentType<EnglishSentenceProblemEditFormikFormProps> => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  return withFormik<
    EnglishSentenceProblemEditFormikFormProps,
    EnglishSentenceProblemEditFormValues
  >({
    mapPropsToValues: (props: EnglishSentenceProblemEditFormikFormProps) => ({
      number: props.number,
      text: props.text,
      lang2: props.lang2,
      translated: props.translated,
      // note: props.note,
    }),
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Sentence is required'),
    }),
    handleSubmit: (
      values: EnglishSentenceProblemEditFormValues,
      formikBag: FormikBag<
        EnglishSentenceProblemEditFormikFormProps,
        EnglishSentenceProblemEditFormValues
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
            problemType: EnglishSentenceProblemTypeId,
            properties: {
              text: values.text,
              lang2: values.lang2,
              translated: values.translated,
              // note: values.note,
            },
          },
          postSuccessProcess: () =>
            history.push(`/app/private/workbook/${workbookId}`),
          postFailureProcess: (error: string) => setErrorMessage(error),
        })
      );
      setProblem(values);
    },
  })(EnglishSentenceProblemEditForm);
};
