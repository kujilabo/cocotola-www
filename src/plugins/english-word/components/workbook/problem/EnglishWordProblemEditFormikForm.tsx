import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik, FormikBag } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from 'app/hooks';
import { updateProblem } from 'features/problem_update';
import { ProblemModel, EnglishWordProblemTypeId } from 'models/problem';
import {
  EnglishWordProblemEditForm,
  EnglishWordProblemEditFormValues,
} from './EnglishWordProblemEditForm';
import { TatoebaSentencePairModel } from 'plugins/tatoeba/models/tatoeba';
import 'App.css';

export interface EnglishWordProblemEditFormikFormProps {
  number: number;
  text: string;
  pos: string;
  lang: string;
  translated: string;
  tatoebaSentences: TatoebaSentencePairModel[];
}
export const englishWordProblemEditFormikForm = (
  workbookId: number,
  problem: ProblemModel,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setProblem: (t: EnglishWordProblemEditFormValues) => void
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
      tatoebaSentences: props.tatoebaSentences,
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
