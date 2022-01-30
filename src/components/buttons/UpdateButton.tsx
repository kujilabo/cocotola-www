import React from 'react';
import { useTranslation } from 'react-i18next';
import { StandardButton } from '../StandardButton';

type UpdateButtonProps = {
  type: string;
  disabled: boolean;
  onClick?: () => void;
};

export const UpdateButton: React.FC<UpdateButtonProps> = (
  props: UpdateButtonProps
) => {
  const [t] = useTranslation();
  return (
    <StandardButton
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      value={t('Update')}
    />
  );
};
