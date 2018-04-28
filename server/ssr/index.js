import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

import routes from '../../common/components/routes';
import configureStore from '../../common/redux';
import fetchComponentData from './fetchComponentData';
import createHtmlString from './createHtmlString';

// Server Side Rendering
export default function Ssr(path, assets, token) {
  return new Promise((resolve, reject) => {
    // Initiate a new redux store (on each request)
    const store = configureStore();

    // check the requested route against react-router available routes
    match({routes: routes(store), location: path},
      (error, redirectLocation, renderProps) => {
        //  need to handle redirection and errors better here
        if (redirectLocation) {
          reject({ err: "redirect", args: redirectLocation.pathname + redirectLocation.search });
          return;
        }
        if (error || !renderProps) {
          reject({err: "continue"});
          return;
        }


        // dispatch all actions for this route and THEN reply
        return fetchComponentData(renderProps, store, token).then(() => {
          // now that we dispatched all actions we can get the initial state
          const state = store.getState();
          let rendered;

          try {
            // render to string all all components for this route
            rendered = renderToString(
              <Provider store={store}>
                <RouterContext {...renderProps} />
              </Provider>
            );
          } catch (e) {
            return reject(new Error(e));
          }
          // custom browser variables
          const browserEnv = {env: { BROWSER: true, REDUX_LOGGER: process.env.REDUX_LOGGER }};


          // build response
          const page = createHtmlString(assets, browserEnv, state, rendered);

          resolve(page);
          // callback(null, page);
        }).catch(err => {
          reject(err);
          // callback(err, null)
        })
      });
  });
}
