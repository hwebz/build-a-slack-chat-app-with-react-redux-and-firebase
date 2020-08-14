import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, useHistory, withRouter} from 'react-router-dom';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';

import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import firebase from './firebase';

import 'semantic-ui-css/semantic.min.css';
import rootReducer from './reducers';
import { setUser } from './actions'

const store = createStore(rootReducer, composeWithDevTools());

const Root = ({ setUser }) => {
  const history = useHistory();

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        history.push('/');
      }
    });
  }, []);

  return (
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  )
}

const RootWithAuth = withRouter(connect(null, { setUser })(Root));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);