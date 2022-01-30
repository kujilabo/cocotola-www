import React from 'react';
import { useTranslation } from 'react-i18next';
import { StandardButton } from '../StandardButton';

type UploadButtonProps = {
  type: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const UploadButton: React.FC<UploadButtonProps> = (
  props: UploadButtonProps
) => {
  const [t] = useTranslation();
  return (
    <StandardButton
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
      value={t('Upload')}
    />
  );
};
