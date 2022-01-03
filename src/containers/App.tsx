import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { logout } from 'features/auth';
import { selectRedirectPath } from 'features/router';
import { PrivateWorkbookList } from 'containers/priavte_workbook/PrivateWorkbookList';
import { PrivateWorkbookNew } from 'containers/priavte_workbook/PrivateWorkbookNew';
import { PrivateWorkbookView } from 'containers/priavte_workbook/PrivateWorkbookView';
import { PrivateProblemNew } from 'containers/workbook/problem/PrivateProblemNew';
import { PrivateProblemEdit } from 'containers/workbook/problem/PrivateProblemEdit';
import { PrivateProblemImport } from 'containers/workbook/problem/PrivateProblemImport';
import { WorkbookStudy } from 'containers/workbook/study/WorkbookStudy';
import { NotFound } from 'containers/NotFound';
import 'App.css';

export function App(): React.ReactElement {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const redirectPath = useAppSelector(selectRedirectPath);
  const redirectToWorkbook = () => {
    history.push('/app/private/workbook');
  };
  const redirectToDefaultSpace = () => {
    history.push('/app/space/1/workbook');
  };

  if (redirectPath === '/app/login') {
    console.log('aaa');
    history.push('/app/login');
    return <div></div>;
  } else if (redirectPath !== '') {
    console.log('bbb');
    history.push(redirectPath);
    return <div></div>;
  }

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
        <Menu.Item
          name="Logout"
          position="right"
          onClick={() => {
            dispatch(logout());
          }}
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
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </div>
  );
}
