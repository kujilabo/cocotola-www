import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Card,
  Divider,
  Grid,
  Header,
} from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  findTranslations,
  selectTranslationFindLoading,
  selectTranslations,
} from '../features/translation_find';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { TranslationModel } from '../models/translation';
import { emptyFunction } from 'utils/util';
import { toDsiplayText } from '../../english-word/utils/util';
import 'App.css';

type ParamTypes = {
  _letter: string;
};

export const TranslationList = (): React.ReactElement => {
  const { _letter } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const loading = useAppSelector(selectTranslationFindLoading);
  const translations = useAppSelector(selectTranslations);
  const [errorMessage, setErrorMessage] = useState('');
  const letter = _letter == '' ? 'a' : _letter;
  const baseUrl = `/plugin/translation`;

  useEffect(() => {
    dispatch(
      findTranslations({
        param: {
          letter: 'a',
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, letter]);

  if (loading) {
    return <AppDimmer />;
  }

  return (
    <Container fluid>
      <AppBreadcrumb links={[]} text={'Translations'} />
      <Divider hidden />
      <Grid>
        <Grid.Row>
          {loading ? <AppDimmer /> : <div />}
          <Grid.Column mobile={16} tablet={16} computer={3}></Grid.Column>
          <Grid.Column mobile={16} tablet={16} computer={13}>
            <Grid doubling columns={3}>
              {translations.map((m: TranslationModel, i: number) => {
                return (
                  <Grid.Column key={i}>
                    <Card>
                      <Card.Content>
                        <Header component="h2">{m.text}</Header>
                      </Card.Content>
                      <Card.Content>{toDsiplayText(m.pos)}</Card.Content>
                      <Card.Content>{m.translated}</Card.Content>
                      <Card.Content>
                        <Button.Group fluid>
                          <Button
                            color="teal"
                            onClick={() =>
                              history.push(`${baseUrl}/${m.text}/${m.pos}/edit`)
                            }
                          >
                            Edit
                          </Button>
                        </Button.Group>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                );
              })}
            </Grid>
            <ErrorMessage message={errorMessage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
