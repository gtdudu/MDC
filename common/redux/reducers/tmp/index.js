function account(state = {
  errors: [],
  loading: false,
}, action) {
  switch (action.type) {
  case 'LOADING':
    return Object.assign({}, state, {
      loading: true,
    });
  default:
    return state;
  }
}

export default account
