import React from 'react';
import { Button, Card, Checkbox, Header, Table } from 'semantic-ui-react';
import { FormikProps } from 'formik';
import { Form, Input, Select } from 'formik-semantic-ui-react';
import { TatoebaSentencePairModel } from 'plugins/tatoeba/models/tatoeba';

import 'App.css';
const makeAuthorUrl = (author: string): string => {
  return `https://tatoeba.org/ja/user/profile/${author}`;
};

const makeStentenceUrl = (sentenceNumber: number): string => {
  return `https://tatoeba.org/ja/sentences/show/${sentenceNumber}`;
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
const langOptions = [{ key: 'ja', text: 'ja', value: 'ja' }];

export interface EnglishWordProblemEditFormValues {
  number: number;
  text: string;
  pos: string;
  lang: string;
  translated: string;
  tatoebaSentences: TatoebaSentencePairModel[];
}
export const EnglishWordProblemEditForm = (
  props: FormikProps<EnglishWordProblemEditFormValues>
) => {
  const { values, isSubmitting } = props;
  return (
    <Form>
      <Card fluid>
        <Card.Content>
          <Header component="h2">Edit problem</Header>
        </Card.Content>
        <Card.Content>
          <Input
            name="text"
            label="Word"
            placeholder="english word"
            errorPrompt
          />
          <Select
            name="pos"
            label="Pos"
            options={posOptions1}
            value={values.pos}
            errorPrompt
          />
          <Select
            name="lang"
            label="Lang"
            options={langOptions}
            value={values.lang}
            errorPrompt
          />
          <Table compact celled definition>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell />
                <Table.HeaderCell>Sentence1</Table.HeaderCell>
                <Table.HeaderCell>Sentence2</Table.HeaderCell>
                <Table.HeaderCell>Tatoeba1</Table.HeaderCell>
                <Table.HeaderCell>Tatoeba2</Table.HeaderCell>
                <Table.HeaderCell>Author1</Table.HeaderCell>
                <Table.HeaderCell>Author2</Table.HeaderCell>
                <Table.HeaderCell>License</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {values.tatoebaSentences.map(
                (m: TatoebaSentencePairModel, i: number) => {
                  return (
                    <Table.Row key={i}>
                      <Table.Cell collapsing>
                        <Checkbox slider />
                      </Table.Cell>
                      <Table.Cell>{m.src.text}</Table.Cell>
                      <Table.Cell>{m.dst.text}</Table.Cell>
                      <Table.Cell>
                        <a
                          href={makeStentenceUrl(m.src.sentenceNumber)}
                          target="_blank"
                        >
                          Sentence
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href={makeStentenceUrl(m.dst.sentenceNumber)}
                          target="_blank"
                        >
                          Sentence
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <a href={makeAuthorUrl(m.src.author)} target="_blank">
                          {m.src.author}
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <a href={makeAuthorUrl(m.src.author)} target="_blank">
                          {m.dst.author}
                        </a>
                      </Table.Cell>
                      <Table.Cell>
                        <a
                          href="https://creativecommons.org/licenses/by/2.0/fr/"
                          target="_blank"
                        >
                          CC BY 2.0 FR
                        </a>
                      </Table.Cell>
                    </Table.Row>
                  );
                }
              )}
            </Table.Body>
          </Table>
        </Card.Content>
        <Card.Content>
          <Button
            type="submit"
            variant="true"
            color="teal"
            disabled={isSubmitting}
          >
            Update
          </Button>
        </Card.Content>
      </Card>
    </Form>
  );
};
