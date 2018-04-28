import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Home extends Component {

  render() {
    return (
  	  <div className="wrap">
        <div className="content">
            {this.props.children}
        </div>

       </div>
    )
  }
}

Home.propTypes = {
  app: PropTypes.object,
  children: React.PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
}

Home.defaultProps = {
 children: null
}

const mapStateToProps = state => {
  return {
    app: state.app,
  };
}

export default connect(mapStateToProps)(Home);
