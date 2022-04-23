import React from 'react';
import { Button } from 'semantic-ui-react';

type DangerButtonProps = {
  value: string;
  type: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const DangerButton: React.FC<DangerButtonProps> = (
  props: DangerButtonProps
) => {
  return (
    <Button
      // variant="true"
      color="red"
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.value}
    </Button>
  );
};
