import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { store } from 'app/store';
import { HealthCheck } from 'containers/HealthCheck';
import { App } from 'containers/App';
import { Login } from 'containers/Login';
import { Callback } from 'containers/Callback';
import { PrivateRoute } from 'PrivateRoute';

const persistor = persistStore(store);

const Index = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router>
        <Switch>
          <Route path="/healthcheck" component={HealthCheck} />
          <Route exact path="/app/login" component={Login} />
          <Route path="/app/callback" component={Callback} />{' '}
          <PrivateRoute path="/">
            <App />
          </PrivateRoute>
        </Switch>
      </Router>
    </PersistGate>
  </Provider>
);

render(<Index />, document.getElementById('root'));
