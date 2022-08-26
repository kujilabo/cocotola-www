import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik, FormikBag } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from 'app/hooks';
import { addProblem } from 'features/problem_add';
import { EnglishSentenceProblemTypeId } from 'models/problem';
import {
  EnglishSentenceProblemNewForm,
  EnglishSentenceProblemNewFormValues,
} from './EnglishSentenceProblemNewForm';
import 'App.css';

export interface EnglishSentenceProblemNewFormikFormProps {
  text: string;
  lang2: string;
  translated: string;
  loading: boolean;
}
export const englishSentenceProblemNewFormikForm = (
  workbookId: number,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setProblem: (t: EnglishSentenceProblemNewFormValues) => void
): React.ComponentType<EnglishSentenceProblemNewFormikFormProps> => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  return withFormik<
    EnglishSentenceProblemNewFormikFormProps,
    EnglishSentenceProblemNewFormValues
  >({
    mapPropsToValues: (props: EnglishSentenceProblemNewFormikFormProps) => ({
      text: props.text,
      lang2: props.lang2,
      translated: props.translated,
      loading: props.loading,
    }),
    validationSchema: Yup.object().shape({
      text: Yup.string().required('Sentence is required'),
    }),
    handleSubmit: (
      values: EnglishSentenceProblemNewFormValues,
      formikBag: FormikBag<
        EnglishSentenceProblemNewFormikFormProps,
        EnglishSentenceProblemNewFormValues
      >
    ) => {
      // onsole.log('handleSubmit');
      dispatch(
        addProblem({
          workbookId: workbookId,
          param: {
            number: 1,
            problemType: EnglishSentenceProblemTypeId,
            properties: {
              text: values.text,
              translated: values.translated,
              lang2: values.lang2,
            },
          },
          postSuccessProcess: () =>
            history.push(`/app/private/workbook/${workbookId}`),
          postFailureProcess: setErrorMessage,
        })
      );
      setProblem(values);
    },
  })(EnglishSentenceProblemNewForm);
};
