import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'formik-semantic-ui-react';

export type InputWordProps = {
  disabled?: boolean;
};
export const InputWord = (props: InputWordProps): React.ReactElement => {
  const [t] = useTranslation();
  return (
    <Input
      name="text"
      label={t('Word')}
      placeholder="english word"
      errorPrompt
      disabled={props.disabled}
    />
  );
};
