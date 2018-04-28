import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

import { default as Home } from './pages/';
import { default as Mdc } from './organisms/';

export default function() {
  return (
     <Route path="/" >
       <IndexRoute component={() => <Home><Mdc /></Home>} />
       <Route path="/404" component={() => <Home>404</Home>} />
       <Redirect from="*" to="/404" />
     </Route>
  );
}
