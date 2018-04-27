import React from 'react';
import { Link } from 'react-router-dom';

class Nav extends React.Component {
  render() {
    // Render either the Log In and register buttons, or the logout button
    // based on the current authentication state.
    const navButtons = this.props.loggedIn ? (
        <div>
          <Link to="/homepage" className="btn btn--dash btn--nav">HomePage</Link>
          {this.props.currentlySending ? (
            <button className="btn--nav" >Loading</button>
          ) : (
            <a href="#" className="btn btn--login btn--nav" onClick={this._logout}>Logout</a>
          )}
        </div>
      ) : (
        <div>
          <Link to="/register" className="btn btn--login btn--nav">Register</Link>
          <Link to="/login" className="btn btn--login btn--nav">Login</Link>
        </div>
      );

    // const navButtons = (<div>
    //       <Link to="/homepage" className="btn btn--dash btn--nav">HomePage</Link>
    //       <Link to="/register" className="btn btn--login btn--nav">Register</Link>
    //       <Link to="/login" className="btn btn--login btn--nav">Login</Link>
    //     </div>);

    return(
      <div className="nav">
        <div className="nav__wrapper">
          {navButtons}
        </div>
      </div>
    );
  }

  _logout() {
    this.props.dispatch(logout());
  }
}

Nav.propTypes = {
  loggedIn: React.PropTypes.bool.isRequired,
  currentlySending: React.PropTypes.bool.isRequired
}

export default Nav;
