import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  getTranslation,
  selectTranslationGetLoading,
  //   selectTranslation,
} from '../features/translation_get';
import { AppBreadcrumb, AppDimmer, ErrorMessage } from 'components';
import { emptyFunction } from 'utils/util';
import 'App.css';

type ParamTypes = {
  _text: string;
  _pos: string;
};

export const TranslationEdit = (): React.ReactElement => {
  const { _text, _pos } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  //   const history = useHistory();
  const loading = useAppSelector(selectTranslationGetLoading);
  //   const translation = useAppSelector(selectTranslation);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    dispatch(
      getTranslation({
        param: {
          text: _text,
          pos: +_pos,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: setErrorMessage,
      })
    );
  }, [dispatch, _text, _pos]);

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
            <Grid doubling columns={3}></Grid>
            <ErrorMessage message={errorMessage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
