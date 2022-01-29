import React from 'react';
import { useTranslation } from 'react-i18next';
import { StandardButton } from '../StandardButton';

type AddButtonProps = {
  type: string;
  disabled: boolean;
  onClick?: () => void;
};

export const AddButton: React.FC<AddButtonProps> = (props: AddButtonProps) => {
  const [t] = useTranslation();
  return (
    <StandardButton
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      value={t('Add')}
    />
  );
};
