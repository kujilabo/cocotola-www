import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Menu, Dropdown } from 'semantic-ui-react';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { initI18n } from 'app/i18n';
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
import { TatoebaList } from 'plugins/tatoeba/containers/TatoebaList';
import { TatoebaImport } from 'plugins/tatoeba/containers/TatoebaImport';

import 'App.css';

export interface AppJwtPayload extends JwtPayload {
  username: string;
  role: string;
}

initI18n();

export const App = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const accessToken = useAppSelector(selectAccessToken);
  const redirectPath = useAppSelector(selectRedirectPath);

  if (redirectPath === '/app/login') {
    // onsole.log('aaa');
    history.push('/app/login');
    return <div></div>;
  } else if (redirectPath !== '') {
    // onsole.log('bbb');
    history.push(redirectPath);
    return <div></div>;
  }

  const decoded =
    accessToken && accessToken != null && accessToken !== ''
      ? jwt_decode<AppJwtPayload>(accessToken) || null
      : null;
  const username = decoded ? decoded.username : '';
  const role = decoded ? decoded.role : '';
  // onsole.log('decoded', decoded);
  console.log('role', role);
  return (
    <div>
      <Menu>
        <Menu.Item>
          <Link to={'/app/private/workbook'}>Private space</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to={'/app/space/1/workbook'}>Public space</Link>
        </Menu.Item>
        {role == 'Owner' ? (
          <Dropdown item text="Plugin">
            <Dropdown.Menu>
              <Dropdown.Item>
                <Link to={'/plugin/translation/list'}>Translation</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <Link to={'/plugin/tatoeba/list'}>Tatoeba</Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <div />
        )}

        <Menu.Menu position="right">
          <Dropdown item text="" icon="bars">
            <Dropdown.Menu>
              <Dropdown.Item>{username}</Dropdown.Item>
              <Dropdown.Item onClick={() => dispatch(logout())}>
                Sign out
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Menu.Menu>
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
        <Route exact path="/plugin/tatoeba/list">
          <TatoebaList />
        </Route>
        <Route exact path="/plugin/tatoeba/import">
          <TatoebaImport />
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
