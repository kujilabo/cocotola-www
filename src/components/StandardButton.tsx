import React from 'react';
import { Button } from 'semantic-ui-react';

type StandardButtonProps = {
  value: string;
  onClick: () => any;
};

export const StandardButton: React.FC<StandardButtonProps> = (
  props: StandardButtonProps
) => {
  return (
    <Button variant="true" color="teal" onClick={props.onClick}>
      {props.value}
    </Button>
  );
};
