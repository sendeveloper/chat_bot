require("./stylesheets/main.less");

import React from 'react';
import ReactDOM, {render} from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import App from './components/app.jsx';
import HomePage from './components/organisms/homepage.jsx';
import LoginPage from './components/organisms/loginpage.jsx';
import RegisterPage from './components/organisms/registerpage.jsx';
import NotFound from './components/organisms/notfound.jsx';

function checkAuth(nextState, replaceState) {
	// let { loggedIn } = store.getState();
	let loggedIn = false;

	// check if the path isn't dashboard
	// that way we can apply specific logic
	// to display/render the path we want to
	if (nextState.location.pathname !== '/home') {
		if (loggedIn) {
		  if (nextState.location.state && nextState.location.pathname) {
		    replaceState(null, nextState.location.pathname);
		  } else {
		    replaceState(null, '/');
		  }
		}
	} else {
		// If the user is already logged in, forward them to the homepage
		if (!loggedIn) {
		  if (nextState.location.state && nextState.location.pathname) {
		    replaceState(null, nextState.location.pathname);
		  } else {
		    replaceState(null, '/');
		  }
		}
	}
}

// render(<App/>, document.getElementById('react-app'));
ReactDOM.render(
    <BrowserRouter>
      <div>
        <Route exact path='/' component={App}/>
        <Route path='/login' onEnter={checkAuth} component={LoginPage}/>
        <Route path='/register' onEnter={checkAuth} component={RegisterPage}/>
        <Route path='/home' onEnter={checkAuth} component={HomePage}/>
      </div>
    </BrowserRouter>,
  document.getElementById('react-app')
);
