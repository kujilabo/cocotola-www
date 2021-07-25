import React from 'react';
import { Switch } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

import { useAppSelector, useAppDispatch } from 'app/hooks';

import { logout } from 'features/auth';
import 'App.css';
import { selectRedirectPath } from 'features/router';

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
      <Switch></Switch>
    </div>
  );
}
