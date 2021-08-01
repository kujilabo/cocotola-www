import React from 'react';
import { Message } from 'semantic-ui-react';

type ErrorMessageProps = {
  message: string;
};

export const ErrorMessage: React.FC<ErrorMessageProps> = (
  props: ErrorMessageProps
) => {
  if (props.message) {
    return (
      <Message negative>
        <Message.Header>{props.message}</Message.Header>
      </Message>
    );
  }
  return <div />;
};
