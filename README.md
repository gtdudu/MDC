#Todo
.env_prod

## Fetching Data

Redux actions must be plain objects, but redux-thunk allows us to return promises.
If you want to hydrate your state server side, you need to declare a static function called fetchData in your components
that returns a dispatch(promise).

When all fetchData functions for a given route are resolved, then the server can reply.

Example :

```
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchShowsNeeded } from '../../actions/show.js';

export class Index extends Component {

  // server and client
  static fetchData({ dispatch }) {
    return dispatch(fetchShowsNeeded())
  }

  // client only
  componentDidMount() {
    const { dispatch } = this.props;
    if (this.props.shows.length === 0) {
      Index.fetchData({ dispatch });
    }
  }
  ...

```
