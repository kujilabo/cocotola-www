import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from 'formik-semantic-ui-react';

export type InputTrasnslatedWordProps = {
  disabled?: boolean;
};
export const InputTrasnslatedWord = (
  props: InputTrasnslatedWordProps
): React.ReactElement => {
  const [t] = useTranslation();
  return (
    <Input
      name="translated"
      label={t('Translated')}
      placeholder="translated"
      errorPrompt
      disabled={props.disabled}
    />
  );
};
