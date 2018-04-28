import React, { Component } from 'react';

class Mdc extends Component {

  render() {
    return (
  	  <div className="mdc">
        <h1>MDC</h1>
        <p>Mercenaires Du Code</p>
      </div>
    )
  }
}

Mdc.defaultProps = {
 children: null
}

export default Mdc;
