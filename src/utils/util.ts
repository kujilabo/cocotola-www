import { AxiosRequestConfig } from 'axios';

export const emptyFunction = () => {
  return;
};

export const jsonHeaders = (accessToken: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };
};

export const jsonRequestConfig = (accessToken: string): AxiosRequestConfig => {
  return {
    headers: jsonHeaders(accessToken),
  };
};
