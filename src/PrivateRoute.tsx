import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import jwt_decode, { JwtPayload } from 'jwt-decode';
import { useEffect } from 'react';

import { useAppSelector, useAppDispatch } from 'app/hooks';
import {
  selectAuthFailed,
  selectAccessToken,
  selectRefreshToken,
  selectAuthLoading,
  refreshAccessToken,
} from 'features/auth';

export function PrivateRoute(props: RouteProps): JSX.Element {
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const failed = useAppSelector(selectAuthFailed);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);

  let isAccessTokenExpired = true;
  if (accessToken && accessToken != null && accessToken !== '') {
    const decoded = jwt_decode<JwtPayload>(accessToken) || null;
    if (decoded.exp) {
      isAccessTokenExpired = decoded.exp < new Date().getTime() / 1000;
    }
  }

  let isRefreshTokenExpired = true;
  if (refreshToken && refreshToken != null && refreshToken !== '') {
    const decoded = jwt_decode<JwtPayload>(refreshToken) || null;
    if (decoded.exp) {
      isRefreshTokenExpired = decoded.exp < new Date().getTime() / 1000;
    }
  }

  useEffect(() => {
    // onsole.log('failed', failed)
    if (!failed && !loading && isAccessTokenExpired && !isRefreshTokenExpired) {
      // onsole.log('xxx refreshAccessToken');
      dispatch(
        refreshAccessToken({
          refreshToken: refreshToken,
        })
      );
    }
  }, [
    dispatch,
    loading,
    refreshToken,
    isAccessTokenExpired,
    isRefreshTokenExpired,
  ]);

  if (failed) {
    return <div>failed</div>;
  } else if (!loading && isAccessTokenExpired && !isRefreshTokenExpired) {
    return <div>Refreshing...</div>;
  } else if (isRefreshTokenExpired) {
    return (
      <Route
        render={(props) => (
          <Redirect
            to={{
              pathname: '/app/login',
              state: { from: props.location },
            }}
          />
        )}
      />
    );
  } else {
    return <Route render={() => props.children} />;
  }
}
