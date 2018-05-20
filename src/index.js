import React from 'react';
import { render } from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Header from './Header';
import UserContextProvider, { UserContext } from './Provider';

// Pass your GraphQL endpoint to uri
const client = new ApolloClient({ uri: 'http://nlbavwixs:55555/graphql' });

const ApolloApp = AppComponent => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <UserContextProvider>
        <Header>
          <AppComponent />
        </Header>
      </UserContextProvider>
    </BrowserRouter>
  </ApolloProvider>
);

render(ApolloApp(AppRoutes), document.getElementById('root'));
