import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

export const AppDimmer = () => {
  return (
    <Dimmer active>
      <Loader>Loading</Loader>
    </Dimmer>
  );
};
