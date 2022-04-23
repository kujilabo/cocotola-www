import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Input } from 'semantic-ui-react';
import { saveAs } from 'file-saver';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import {
  exportTranslation,
  selectTranslationExportLoading,
} from '../features/translation_export';
import 'App.css';
import { AppDimmer } from 'components';

export const TranslationListMenu: React.FC = () => {
  const dispatch = useAppDispatch();
  const translationExportLoading = useAppSelector(
    selectTranslationExportLoading
  );
  const [errorMessage, setErrorMessage] = useState('');

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
          {translationExportLoading ? <AppDimmer /> : <div />}
          <Menu.Item>
            <Input placeholder="Search..." />
          </Menu.Item>
          <Menu.Item>
            <Link to={'/plugin/translation/import'}> Import Translations</Link>
          </Menu.Item>
          <Menu.Item onClick={onExportButtonClick}>
            Export translations
            {errorMessage}
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    </Menu>
  );
};
