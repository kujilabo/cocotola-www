import React from 'react';
import { Button } from 'semantic-ui-react';

type StandardButtonProps = {
  value: string;
  type: string;
  disabled?: boolean;
  onClick?: () => void;
};

export const StandardButton: React.FC<StandardButtonProps> = (
  props: StandardButtonProps
) => {
  return (
    <Button
      variant="true"
      color="teal"
      type={props.type}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.value}
    </Button>
  );
};
