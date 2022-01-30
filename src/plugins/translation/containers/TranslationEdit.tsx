import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Divider, Grid } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  AppBreadcrumb,
  AppDimmer,
  ErrorMessage,
  SuccessMessage,
} from 'components';

import { translationNewFormikForm } from '../components/TranslationNewFormikForm';
import { translationEditFormikForm } from '../components/TranslationEditFormikForm';
import { selectTranslationAddLoading } from '../features/translation_add';
import { selectTranslationUpdateLoading } from '../features/translation_update';
import {
  getTranslations,
  selectTranslationGetListLoading,
  selectTranslations,
} from '../features/translation_get_list';
import { TranslationModel } from '../models/translation';
import 'App.css';

const findTranslationByPos = (
  translations: TranslationModel[],
  pos: number
): TranslationModel => {
  for (let i = 0; i < translations.length; i++) {
    if (translations[i].pos == pos) {
      return translations[i];
    }
  }
  throw 'not found';
};

const removeTranslationByPos = (
  translations: TranslationModel[],
  pos: number
): TranslationModel[] => {
  let index = 0;
  for (let i = 0; i < translations.length; i++) {
    if (translations[i].pos == pos) {
      index = i;
      break;
    }
  }
  translations.splice(index, 1);

  return translations;
};
type ParamTypes = {
  _text: string;
  _pos: string;
};
export const TranslationEdit = (): React.ReactElement => {
  const { _text, _pos } = useParams<ParamTypes>();
  const dispatch = useAppDispatch();
  const translationGetListLoading = useAppSelector(
    selectTranslationGetListLoading
  );
  const translationAddLoading = useAppSelector(selectTranslationAddLoading);
  const translationUpdateLoading = useAppSelector(
    selectTranslationUpdateLoading
  );
  const loading =
    translationGetListLoading ||
    translationAddLoading ||
    translationUpdateLoading;
  const orgTranslations = useAppSelector(selectTranslations);
  const [translations, setTranslations] = useState(orgTranslations);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [newValues, setNewValues] = useState({
    text: _text,
    pos: '',
    translated: '',
  });
  const [editValues, setEditValues] = useState({
    lang: '',
    text: '',
    pos: '',
    translated: '',
    provider: '',
  });
  const localGetTranslations = () => {
    return getTranslations({
      param: {
        text: _text,
      },
      postSuccessProcess: (translations: TranslationModel[]) => {
        const t = findTranslationByPos(translations, +_pos);
        setEditValues({
          lang: 'ja',
          text: t.text,
          pos: t.pos.toString(),
          translated: t.translated,
          provider: t.provider,
        });
        setTranslations(removeTranslationByPos(translations, +_pos));
      },
      postFailureProcess: setErrorMessage,
    });
  };

  useEffect(() => {
    dispatch(localGetTranslations());
  }, [dispatch, _text, _pos]);

  const TranslationEditFormikForm = translationEditFormikForm(
    setSuccessMessage,
    setErrorMessage,
    setEditValues
  );
  const TranslationNewFormikForm = translationNewFormikForm(
    setSuccessMessage,
    setErrorMessage,
    setNewValues
  );

  return (
    <Container fluid>
      <AppBreadcrumb
        links={[{ text: 'Translations', url: '/plugin/translation/list' }]}
        text={_text}
      />
      <Divider hidden />
      {loading ? <AppDimmer /> : <div />}
      <Grid padded>
        <Grid.Row>
          <Grid doubling columns={3}>
            <Grid.Column>
              <TranslationEditFormikForm
                index={0}
                slectedLang={'ja'}
                lang={editValues.lang}
                text={editValues.text}
                pos={editValues.pos}
                translated={editValues.translated}
                provider={editValues.provider}
                refreshTranslations={() => dispatch(localGetTranslations())}
              />
            </Grid.Column>
            <Grid.Column>
              <TranslationNewFormikForm
                text={newValues.text}
                pos={newValues.pos}
                translated={newValues.translated}
                refreshTranslations={() => dispatch(localGetTranslations())}
              />
            </Grid.Column>
          </Grid>
        </Grid.Row>
        <Grid.Row>
          <Grid doubling columns={3}>
            {translations.map((t: TranslationModel, i: number) => {
              return (
                <Grid.Column key={t.pos}>
                  <TranslationEditFormikForm
                    index={i}
                    slectedLang={'ja'}
                    text={t.text}
                    pos={t.pos.toString()}
                    translated={t.translated}
                    lang={t.lang}
                    provider={t.provider}
                    refreshTranslations={() => dispatch(localGetTranslations())}
                  />
                </Grid.Column>
              );
            })}
          </Grid>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <SuccessMessage message={successMessage} />
            <ErrorMessage message={errorMessage} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};
