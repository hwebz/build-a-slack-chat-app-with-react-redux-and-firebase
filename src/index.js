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
import { setUser, clearUser } from './actions'
import DisplayIf from './components/Common/DisplayIf';
import Spinner from './Spinner';

const store = createStore(rootReducer, composeWithDevTools());

const Root = ({ setUser, clearUser, isLoading }) => {
  const history = useHistory();

  /*eslint-disable */
  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        history.push('/');
      } else {
        history.push('/login');
        clearUser();
      }
    });
  }, []);
  /*eslint-enable */

  return (
    <React.Fragment>
      <DisplayIf condition={!isLoading}>
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
      </DisplayIf>
      <DisplayIf condition={isLoading}>
        <Spinner />
      </DisplayIf>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
  // <React.StrictMode>
    <Provider store={store}>
      <Router>
        <RootWithAuth />
      </Router>
    </Provider>,
  // </React.StrictMode>,
  document.getElementById('root')
);