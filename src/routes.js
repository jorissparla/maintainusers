import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import App from './App';
import Login from './Login';

class AppRoutes extends React.Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/main" component={App} />
      </Switch>
    );
  }
}
export default AppRoutes;
