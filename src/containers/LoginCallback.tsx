import React from 'react';
import queryString from 'query-string';
import { Redirect } from 'react-router';
import jwt_decode, { JwtPayload } from 'jwt-decode';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  selectAccessToken,
  selectAuthLoading,
  selectAuthFailed,
  googleAuthorize,
} from 'features/auth';
import { emptyFunction } from 'utils/util';
import { AppDimmer } from 'components';

export const LoginCallback = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector(selectAccessToken);
  let isAccessTokenExpired = true;
  if (accessToken && accessToken != null && accessToken !== '') {
    // onsole.log('decode acc', accessToken);
    const decoded = jwt_decode<JwtPayload>(accessToken) || null;
    if (decoded.exp) {
      isAccessTokenExpired = decoded.exp < new Date().getTime() / 1000;
    }
  }

  const authLoading = useAppSelector(selectAuthLoading);
  const authFailed = useAppSelector(selectAuthFailed);
  const location = window.location.search;
  // onsole.log('Callback', authLoading, isAccessTokenExpired);
  if (authFailed) {
    return <div>Failed</div>;
  } else if (authLoading === false && isAccessTokenExpired) {
    const parsed = queryString.parse(location);
    const code = '' + parsed.code || '';

    dispatch(
      googleAuthorize({
        param: {
          organizationName: 'cocotola',
          code: code,
        },
        postSuccessProcess: emptyFunction,
        postFailureProcess: (error: string) => {
          console.log('callback error', error);
          return;
        },
      })
    );
    return <AppDimmer />;
  } else if (!isAccessTokenExpired) {
    return <Redirect to="/" />;
  } else {
    return <AppDimmer />;
  }
};
