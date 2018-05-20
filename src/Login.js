import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import gql from 'graphql-tag';
import { Mutation, compose, graphql } from 'react-apollo';

import UserContextProvider, { UserContext } from './Provider';

const GENERATE_PIN = gql`
  mutation generateTempPIN($email: String!) {
    generateTempPIN(email: $email) {
      error
      user {
        id
      }
    }
  }
`;

const SIGNIN_WITH_PIN = gql`
  mutation signinUsingPin($email: String!, $PIN: String!) {
    signinUsingPin(email: $email, PIN: $PIN) {
      token
      user {
        id
        email
        role
        image
      }
    }
  }
`;
const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
    marginLeft: '30%',
    //marginTop: '10%',
    width: '50%'
  }),
  button: {
    margin: theme.spacing.unit
  },

  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200
  }
});

function to(promise) {
  return promise
    .then(data => {
      return [null, data];
    })
    .catch(err => [err]);
}

class LoginForm extends Component {
  state = { email: '', pin: '', error: '', pinSent: false };
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  handleSendPIN = async () => {
    this.checkErrors('PIN Code sent');
    const { data } = await this.props.generatePIN({ variables: { email: this.state.email } });
    this.setState({ pinSent: true });
    console.log('result', data);
  };
  handleSignInWithPIN = async context => {
    console.log('CONTEXT', context);

    if (this.checkErrors()) return;
    let err, result;
    [err, result] = await to(
      this.props.signinUsingPin({
        variables: { email: this.state.email, PIN: this.state.pin }
      })
    );
    //  console.log('>>>', result.data.signinUsingPin);
    if (err) {
      this.setState({ error: 'invalid email/PIN combination' });
    } else {
      const data = result.data.signinUsingPin;
      context.setUser(data.user);
      this.props.history.push('/main');
    }
    console.log('result', result, err);
  };

  checkErrors = msg => {
    if (!this.state.email) {
      this.setState({ error: 'Enter email address' });
      return true;
    } else {
      if (!this.state.pin) {
        this.setState({ error: 'Enter PIN code (Check email)' });
        return true;
      }
    }
    this.setState({ error: msg || '' });
    return false;
  };

  render() {
    const { classes } = this.props;
    const { pinSent } = this.state;
    return (
      <div>
        <Paper className={classes.root} elevation={4}>
          <Typography variant="headline" component="h3">
            Sign In.
          </Typography>
          <Typography component="div">
            {!pinSent && (
              <TextField
                id="name"
                type="email"
                label="Email Address"
                className={classes.textField}
                value={this.state.email}
                onChange={this.handleChange('email')}
                margin="normal"
              />
            )}
            {pinSent && (
              <TextField
                id="PIN"
                label="PIN code"
                className={classes.textField}
                value={this.state.pin}
                onChange={this.handleChange('pin')}
                margin="normal"
              />
            )}
          </Typography>

          <div />
          {!pinSent && (
            <Button
              variant="raised"
              color="primary"
              className={classes.button}
              onClick={this.handleSendPIN}
            >
              Send PIN
            </Button>
          )}
          {pinSent && (
            <UserContext.Consumer>
              {context => {
                return (
                  <Button
                    variant="raised"
                    color="secondary"
                    className={classes.button}
                    onClick={() => {
                      this.handleSignInWithPIN(context);
                    }}
                  >
                    Login
                  </Button>
                );
              }}
            </UserContext.Consumer>
          )}
          {this.state.error && <Typography component="p">{this.state.error}</Typography>}
        </Paper>
      </div>
    );
  }
}

export default compose(
  graphql(GENERATE_PIN, { name: 'generatePIN' }),
  graphql(SIGNIN_WITH_PIN, { name: 'signinUsingPin' })
)(withStyles(styles)(withRouter(LoginForm)));
