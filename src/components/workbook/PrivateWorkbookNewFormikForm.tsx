import React from 'react';
import { useHistory } from 'react-router-dom';
import { withFormik, FormikBag } from 'formik';
import * as Yup from 'yup';

import { useAppDispatch } from 'app/hooks';
import {
  PrivateWorkbookNewForm,
  PrivateWorkbookNewFormValues,
} from './PrivateWorkbookNewForm';
import { addWorkbook } from 'features/workbook_add';
import 'App.css';

export interface PrivateWorkbookNewFormikFormProps {
  name: string;
  lang2: string;
  questionText: string;
  problemType: string;
  loading: boolean;
}
export const privateWorkbookNewFormikForm = (
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>,
  setWorkbook: (t: PrivateWorkbookNewFormValues) => void
): React.ComponentType<PrivateWorkbookNewFormikFormProps> => {
  const history = useHistory();
  const dispatch = useAppDispatch();

  return withFormik<
    PrivateWorkbookNewFormikFormProps,
    PrivateWorkbookNewFormValues
  >({
    mapPropsToValues: (props: PrivateWorkbookNewFormikFormProps) => ({
      name: props.name,
      lang2: props.lang2,
      questionText: props.questionText,
      problemType: props.problemType,
      loading: props.loading,
    }),
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Name is required'),
      problemType: Yup.string().required('Problem type is required'),
    }),
    handleSubmit: (
      values: PrivateWorkbookNewFormValues,
      formikBag: FormikBag<
        PrivateWorkbookNewFormikFormProps,
        PrivateWorkbookNewFormValues
      >
    ) => {
      // onsole.log('handleSubmit');
      dispatch(
        addWorkbook({
          param: { ...values, spaceKey: 'personal' },
          postSuccessProcess: (id: number) =>
            history.push('/app/private/workbook'),
          postFailureProcess: setErrorMessage,
        })
      );
      setWorkbook(values);
    },
  })(PrivateWorkbookNewForm);
};
