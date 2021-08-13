import React from 'react';
import { Button, Container, Menu } from 'semantic-ui-react';

export function Login(): React.ReactElement {
  const googleAuth = () => {
    let url = 'https://accounts.google.com/o/oauth2/auth';
    url += '?client_id=';
    url += process.env.REACT_APP_CLIENT_ID;
    url += '&redirect_uri=';
    url += process.env.REACT_APP_FRONTEND;
    url += '/app/callback';
    url += '&scope=profile email';
    url += '&response_type=';
    url += 'code';
    url += '&access_type=';
    url += 'offline';
    window.location.href = url;
  };

  return (
    <div>
      <Menu inverted></Menu>
      <Container fluid>
        <Button basic color="teal" onClick={googleAuth}>
          Sign in with Google
        </Button>
      </Container>
    </div>
  );
}
