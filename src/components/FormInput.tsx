import React, { ChangeEvent } from 'react';
import { Form, Input } from 'semantic-ui-react';

type FormInputProps = {
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => any;
};

export const FormInput: React.FC<FormInputProps> = (props: FormInputProps) => {
  return (
    <Form.Field
      control={Input}
      name="text"
      label="Word"
      placeholder="english word"
      onChange={props.onChange}
      value={props.value}
      className="full-width"
    />
  );
};
