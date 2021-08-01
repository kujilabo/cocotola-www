import React, { ChangeEvent } from 'react';
import { Form, Select } from 'semantic-ui-react';

type FormPosSelectProps = {
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>, d: any) => any;
};

const posOptions1 = [
  { key: 'ADJ', text: 'ADJ', value: '1' },
  { key: 'ADV', text: 'ADV', value: '2' },
  { key: 'CONJ', text: 'CONJ', value: '3' },
  { key: 'DET', text: 'DET', value: '4' },
  { key: 'NOUN', text: 'NOUN', value: '6' },
  { key: 'PREP', text: 'PREP', value: '7' },
  { key: 'PRON', text: 'PRON', value: '8' },
  { key: 'VERB', text: 'VERB', value: '9' },
  { key: '', text: '', value: '99' },
];

export const FormPosSelect1: React.FC<FormPosSelectProps> = (
  props: FormPosSelectProps
) => {
  return (
    <Form.Field
      control={Select}
      options={posOptions1}
      label={props.label}
      onChange={props.onChange}
      value={props.value}
    />
  );
};

const posOptions2 = [
  { key: 'ADJ', text: 'ADJ', value: '1' },
  { key: 'ADV', text: 'ADV', value: '2' },
  { key: 'CONJ', text: 'CONJ', value: '3' },
  { key: 'DET', text: 'DET', value: '4' },
  { key: 'NOUN', text: 'NOUN', value: '6' },
  { key: 'PREP', text: 'PREP', value: '7' },
  { key: 'PRON', text: 'PRON', value: '8' },
  { key: 'VERB', text: 'VERB', value: '9' },
];

export const FormPosSelect2: React.FC<FormPosSelectProps> = (
  props: FormPosSelectProps
) => {
  return (
    <Form.Field
      control={Select}
      options={posOptions2}
      label={props.label}
      onChange={props.onChange}
      value={props.value}
    />
  );
};
