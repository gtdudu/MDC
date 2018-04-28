/* eslint-env browser */
import React from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import './components/styles/index.scss'
import Root from './components/';

import configureStore from './redux/';

if (process.env.NODE_ENV !== 'test') {
  console.log("initiating store", window.REDUX_INITIAL_STATE);
  const store = configureStore(window.REDUX_INITIAL_STATE);
  const history = syncHistoryWithStore(browserHistory, store);

  render(
    <Root store={store} history={history} />,
    document.getElementById('root')
  );

  if (module.hot) {
    // enable webpack hot module replacement for Root component
    // (webpack-hot-middleware is responsible for exposing module.hot !)
    module.hot.accept('./components/', () => {
      const NextRoot = require('./components/').default;
      render(
          <NextRoot store={store} history={history} />,
          document.getElementById('root')
      );
    });
  }
}
