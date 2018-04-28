import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { Router } from 'react-router';

import routes from './routes';

function Root({store, history}) {
  return (
    <Provider store={store}>
      <Router history={history}>
      { routes() }
      </Router>
    </Provider>
  );
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
