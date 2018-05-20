import React, { Component } from 'react';

const UserContext = React.createContext({ fullname: '' });

export default class UserContextProvider extends Component {
  state = {
    username: 'Joris',
    role: 'admin',
    image: '',
    setUser: ({ email, role, image }) => this.setState({ username: email, role: role, image })
  };

  render() {
    return <UserContext.Provider value={this.state}>{this.props.children}</UserContext.Provider>;
  }
}

export { UserContext };
