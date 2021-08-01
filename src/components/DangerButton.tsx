import React from 'react';
import { Button } from 'semantic-ui-react';

type DangerButtonProps = {
  value: string;
  onClick: () => any;
};

export const DangerButton: React.FC<DangerButtonProps> = (
  props: DangerButtonProps
) => {
  return (
    <Button variant="true" color="red" onClick={props.onClick}>
      {props.value}
    </Button>
  );
};
