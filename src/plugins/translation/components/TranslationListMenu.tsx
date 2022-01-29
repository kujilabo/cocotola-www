import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Menu, Input } from 'semantic-ui-react';
import { saveAs } from 'file-saver';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import {
  exportTranslation,
  selectTranslationExportLoading,
} from '../features/translation_export';
import 'App.css';
import { AppDimmer } from 'components';

export const TranslationListMenu: React.FC = () => {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const translationExportLoading = useAppSelector(
    selectTranslationExportLoading
  );
  const [errorMessage, setErrorMessage] = useState('');
  const onImportButtonClick = () => {
    history.push(`/plugin/translation/import`);
  };
  if (translationExportLoading) {
    return <AppDimmer />;
  }
  const onExportButtonClick = () => {
    dispatch(
      exportTranslation({
        postSuccessProcess: (blob: Blob) => saveAs(blob, 'translations.csv'),
        postFailureProcess: setErrorMessage,
      })
    );
  };
  return (
    <Menu vertical fluid>
      <Menu.Item>
        Translations
        <Menu.Menu>
          <Menu.Item>
            <Input placeholder="Search..." />
          </Menu.Item>
          <Menu.Item onClick={onImportButtonClick}>
            Import Translations
          </Menu.Item>
          <Menu.Item>
            <Button size="mini" color="teal" onClick={onExportButtonClick}>
              Export translations
            </Button>
            {errorMessage}
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};
