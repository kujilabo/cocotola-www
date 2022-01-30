import React from 'react';
import { Message } from 'semantic-ui-react';

type SuccessMessageProps = {
  message: string;
};

export const SuccessMessage: React.FC<SuccessMessageProps> = (
  props: SuccessMessageProps
) => {
  if (props.message) {
    return (
      <Message positive>
        <Message.Header>{props.message}</Message.Header>
      </Message>
    );
  }
  return <div />;
};
