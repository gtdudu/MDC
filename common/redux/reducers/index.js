import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import tmp from './tmp/';

const rootReducer = combineReducers({
  tmp,
  routing: routerReducer
});

module.exports = rootReducer;
