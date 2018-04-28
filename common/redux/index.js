import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import IS_BROWSER from '../constants/environment.js'

const configureStore = initialState => {
  const middleware = [
    thunk
  ];

  if (process.env.BROWSER === true && process.env.REDUX_LOGGER === true) {
    middleware.push(createLogger());
  }

  const composeEnhancers = IS_BROWSER && typeof window === 'object' ?
    // eslint-disable-next-line no-undef
    (global.window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose) :
    compose;

  const store = createStore(require('./reducers'), initialState, composeEnhancers(
    applyMiddleware(...middleware)
  ));

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');

      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
};

export default configureStore;
