import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import UserContextProvider, { UserContext } from './Provider';
import Avatar from '@material-ui/core/Avatar';

const styles = {
  root: {
    flexGrow: 1
  },
  flex: {
    flex: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  avatar: {
    margin: 10
  }
};

class Header extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Title
            </Typography>
            <Button color="inherit">Login</Button>
            <Button>
              <UserContext.Consumer>
                {context => {
                  console.log('ContextMain', context);
                  return <Avatar src={context.image} className={classes.Avatar} />;
                }}
              </UserContext.Consumer>
            </Button>
          </Toolbar>
        </AppBar>
        {this.props.children}
      </div>
    );
  }
}

export default withStyles(styles)(Header);
