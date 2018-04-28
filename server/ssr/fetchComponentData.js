/*
** Gather all data relative to component's tree for the requested route
*/
import _ from 'lodash';

function aggregateFetchData(item) {
  const result = [];
  function iter(r) {
    if (r && r.type && r.type.fetchData) {
      result.push(r.type.fetchData);
    }

    if (r && r.props && r.props.children) {
      if (_.isArray(r.props.children)) {
        return r.props.children.forEach(x => iter(x))
      }
      return iter(r.props.children)
    }
  }
  iter(item);
  return result;
}

export default function fetchComponentData(renderProps, store, token) {
  const filteredComponents = renderProps
  	.components
    .filter(component => component !== undefined)
  ;

  const hold = [];
  _.each(filteredComponents, component => {
    const allFetchData = _.isFunction(component) && !component.WrappedComponent ?
        aggregateFetchData(component()) :
        aggregateFetchData(component);

    const { query, params, history } = renderProps;

    _.forEach(allFetchData, func => {
      hold.push(func({
        dispatch: store.dispatch,
        query,
        params,
        history,
        token,
      }))
    });
  });

  if (!_.isArray(hold[0])) {
    return Promise.resolve();
  }

  return Promise.all(hold[0])
    .then(() => {
      return
    })
    .catch(err => {
      console.log("error: fetchComponentData after all", err);
      return
     })
  ;
}
