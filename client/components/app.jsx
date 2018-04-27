import React from 'react';

import Chat from './organisms/chat.jsx';
import Nav from './molecules/nav.jsx';

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
        loggedIn: false,
        currentlySending: false,
    };
  }
  render() {
    return(
      <div className="wrapper">
        <Nav loggedIn={this.state.loggedIn} dispatch={this.props.dispatch} currentlySending={this.state.loggedIn} />
        { this.props.children }
      </div>
    )
  }
}
App.propTypes = {
  
}

export default App;

