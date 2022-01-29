import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { logout, selectAccessToken } from 'features/auth';
import { selectRedirectPath } from 'features/router';
import { PrivateWorkbookList } from 'containers/priavte_workbook/PrivateWorkbookList';
import { PrivateWorkbookNew } from 'containers/priavte_workbook/PrivateWorkbookNew';
import { PrivateWorkbookEdit } from 'containers/priavte_workbook/PrivateWorkbookEdit';
import { PrivateWorkbookView } from 'containers/priavte_workbook/PrivateWorkbookView';
import { PrivateProblemNew } from 'containers/workbook/problem/PrivateProblemNew';
import { PrivateProblemEdit } from 'containers/workbook/problem/PrivateProblemEdit';
import { PrivateProblemImport } from 'containers/workbook/problem/PrivateProblemImport';
import { WorkbookStudy } from 'containers/workbook/study/WorkbookStudy';
import { Home } from 'containers/Home';
import { NotFound } from 'containers/NotFound';

// plugin
import { TranslationList } from 'plugins/translation/containers/TranslationList';
import { TranslationEdit } from 'plugins/translation/containers/TranslationEdit';
import { TranslationImport } from 'plugins/translation/containers/TranslationImport';

import 'App.css';

export interface AppJwtPayload extends JwtPayload {
  username: string;
}
i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        Word: 'Word',
        Pos: 'Pos',
        Translated: 'Translated',
      },
    },
    ja: {
      translation: {
        Word: '英単語',
        Pos: '品詞',
        Translated: '翻訳',
      },
    },
  },
  lng: 'ja',
  fallbackLng: 'ja',
  interpolation: { escapeValue: false },
});

export const App = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const accessToken = useAppSelector(selectAccessToken);
  const redirectPath = useAppSelector(selectRedirectPath);
  const redirectToWorkbook = () => {
    history.push('/app/private/workbook');
  };
  const redirectToDefaultSpace = () => {
    history.push('/app/space/1/workbook');
  };

  if (redirectPath === '/app/login') {
    // onsole.log('aaa');
    history.push('/app/login');
    return <div></div>;
  } else if (redirectPath !== '') {
    // onsole.log('bbb');
    history.push(redirectPath);
    return <div></div>;
  }

  const decoded = jwt_decode<AppJwtPayload>(accessToken) || null;
  const username = decoded.username;
  // onsole.log('decoded', decoded);
  return (
    <div>
      <Menu inverted>
        <Menu.Item
          name="Private space"
          onClick={redirectToWorkbook}
        ></Menu.Item>
        <Menu.Item
          name="Public space"
          onClick={redirectToDefaultSpace}
        ></Menu.Item>
        <Dropdown item text="Plugin">
          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => history.push('/plugin/translation/list')}
            >
              Translation
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Menu.Item
          name={username + ' Logout'}
          position="right"
          onClick={() => dispatch(logout())}
        ></Menu.Item>
      </Menu>
      <Switch>
        <Route exact path="/app/private/workbook">
          <PrivateWorkbookList />
        </Route>
        <Route exact path="/app/private/workbook/new">
          <PrivateWorkbookNew />
        </Route>
        <Route exact path="/app/private/workbook/:_workbookId">
          <PrivateWorkbookView />
        </Route>
        <Route exact path="/app/private/workbook/:_workbookId/edit">
          <PrivateWorkbookEdit />
        </Route>
        <Route exact path="/app/private/workbook/:_workbookId/problem/new">
          <PrivateProblemNew />
        </Route>
        <Route
          exact
          path="/app/private/workbook/:_workbookId/problem/:_problemId/edit"
        >
          <PrivateProblemEdit />
        </Route>
        <Route exact path="/app/private/workbook/:_workbookId/import">
          <PrivateProblemImport />
        </Route>
        <Route exact path="/app/workbook/:_workbookId/study/:_studyType">
          <WorkbookStudy />
        </Route>

        {/* plugin */}
        <Route exact path="/plugin/translation/list">
          <TranslationList />
        </Route>
        {/* <Route exact path="/plugin/translation/list/:_letter">
          <TranslationList />
        </Route> */}
        <Route exact path="/plugin/translation/:_text/:_pos/edit">
          <TranslationEdit />
        </Route>
        <Route exact path="/plugin/translation/import">
          <TranslationImport />
        </Route>

        <Route exact path="/">
          <Home />
        </Route>
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
};
