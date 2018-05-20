import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import './index.css';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import deepPurple from '@material-ui/core/colors/deepPurple';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/Search';
import UserContextProvider, { UserContext } from './Provider';

const styles = theme => ({
  root: {
    width: '50%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    display: 'flex'
  },
  right: {
    display: 'flex',
    padding: 10,
    width: '100%',
    border: '1px solid lightgrey'
  },
  avatar: {
    margin: 10
  },
  orangeAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepOrange[500]
  },
  purpleAvatar: {
    margin: 10,
    color: '#fff',
    backgroundColor: deepPurple[500]
  },
  row: {
    display: 'flex',
    justifyContent: 'center'
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
});

const EMPLOYEES_QUERY = gql`
  query {
    employees(team: "TLS") {
      id
      navid
      fullname
      team
      location
      image
    }
  }
`;

const EMPLOYEE_QUERY = gql`
  query employee($navid: String) {
    employees(navid: $navid) {
      id
      navid
      fullname
      image
    }
  }
`;

const EmployeeCard = ({ id }) => {
  console.log('EmployeeCard', id);
  if (!id) return <div />;
  console.log('Hier');
  return (
    <div className="twoparts">
      <Query query={EMPLOYEE_QUERY} variables={{ navid: id }}>
        {({ loading, error, data }) => {
          if (loading) return <div>Loading...</div>;
          if (error) return <div>Error :(</div>;
          const emp = data.employees[0];
          return <h1>{emp.fullname}</h1>;
        }}
      </Query>
    </div>
  );
};

class App extends React.Component {
  state = { selected: null, searchText: '' };

  getInitials = name =>
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  listUsers = ({ employees }) => {
    const { classes } = this.props;
    console.log(this.state.searchText);
    return employees.filter(u => u.fullname.includes(this.state.searchText)).map(user => (
      <ListItem
        key={user.id}
        className="user"
        onClick={() => this.setState({ selected: user.navid })}
      >
        {user.image ? (
          <Avatar className={classes.avatar} src={user.image} />
        ) : (
          <Avatar className={classes.purpleAvatar}>{this.getInitials(user.fullname)}</Avatar>
        )}
        <ListItemText primary={user.fullname} secondary={user.location} />
      </ListItem>
    ));
  };
  handleChange = ({ target: { value } }) => {
    console.log('value', value);
    this.setState({ searchText: value });
  };
  render() {
    console.log(this.props);
    const { classes } = this.props;
    return (
      <div>
        <UserContext.Consumer>
          {context => {
            console.log('ContextMain', context);
            return <Avatar src={context.image} className={classes.Avatar} />;
          }}
        </UserContext.Consumer>
        <Query query={EMPLOYEES_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <div>Loading...</div>;
            if (error) return <div>Error :(</div>;
            return (
              <div className={classes.container}>
                <div className={classes.root}>
                  <FormControl className={classes.margin}>
                    <InputLabel htmlFor="input-with-icon-adornment">Search</InputLabel>
                    <TextField
                      className={classes.margin}
                      id="input-with-icon-textfield"
                      value={this.state.searchText || ''}
                      onChange={this.handleChange}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="end">
                            <AccountCircle />
                          </InputAdornment>
                        )
                      }}
                    />
                  </FormControl>
                  <List>{this.listUsers(data)}</List>
                </div>
                <div className={classes.right}>
                  <EmployeeCard id={this.state.selected} />
                </div>
              </div>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(App);
