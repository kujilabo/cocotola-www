import React from 'react';
import { Card, Header } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { Form } from 'formik-semantic-ui-react';
import { AddButton } from 'components/buttons';
import { InputWord, InputTrasnslatedWord, SelectPos } from '.';
import 'App.css';

export interface TranslationNewFormValues {
  text: string;
  pos: string;
  translated: string;
}
export const TranslationNewForm = (
  props: FormikProps<TranslationNewFormValues>
) => {
  const { isSubmitting } = props;
  return (
    <Form>
      <Card fluid>
        <Card.Content>
          <Header component="h2">New Translation</Header>
        </Card.Content>
        <Card.Content>
          <InputWord disabled />
          <SelectPos />
          <InputTrasnslatedWord />
        </Card.Content>
        <Card.Content>
          <AddButton type="submit" disabled={isSubmitting} />
        </Card.Content>
      </Card>
    </Form>
  );
};
