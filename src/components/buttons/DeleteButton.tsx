import React from 'react';
import { useTranslation } from 'react-i18next';
import { DangerButton } from 'components';

type DeleteButtonProps = {
  type: string;
  disabled: boolean;
  onClick?: () => void;
};

export const DeleteButton: React.FC<DeleteButtonProps> = (
  props: DeleteButtonProps
) => {
  const [t] = useTranslation();
  return (
    <DangerButton
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      value={t('Delete')}
    />
  );
};
