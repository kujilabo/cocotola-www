import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import { logout } from 'features/auth';
import { selectRedirectPath } from 'features/router';
import { PrivateWorkbookList } from 'containers/priavte_workbook/PrivateWorkbookList';
import 'App.css';

export function App(): JSX.Element {
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
      </Switch>
    </div>
  );
}
