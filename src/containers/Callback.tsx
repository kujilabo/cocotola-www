import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  callback,
  selectAccessToken,
  selectAuthLoading,
  selectAuthFailed,
} from '../features/auth';

export function Callback(): JSX.Element {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  let isAccessTokenExpired = true;
  if (accessToken && accessToken != null && accessToken !== '') {
    console.log('decode acc', accessToken);
    const decoded = jwt_decode<JwtPayload>(accessToken) || null;
    if (decoded.exp) {
      isAccessTokenExpired = decoded.exp < new Date().getTime() / 1000;
    }
  }

  const authLoading = useAppSelector(selectAuthLoading);
  const authFailed = useAppSelector(selectAuthFailed);
  const location = window.location.search;
  console.log('Callback', authLoading, isAccessTokenExpired);
  if (authFailed) {
    return <div>Failed</div>;
  } else if (authLoading === false && isAccessTokenExpired) {
    const parsed = queryString.parse(location);
    const code = '' + parsed.code || '';

    dispatch(
      callback({
        param: {
          organizationName: 'cocotola',
          code: code,
        },
        postSuccessProcess: () => {
          return;
        },
        postFailureProcess: (error: string) => {
          console.log('callback error', error);
          return;
        },
      })
    );
    return <div>CALLBACK</div>;
  } else if (!isAccessTokenExpired) {
    return <Redirect to="/" />;
  } else {
    return <div>Loading</div>;
  }
}
