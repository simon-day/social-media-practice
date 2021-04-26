import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import "./App.css";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";
import { Container } from "semantic-ui-react";

import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/AuthRoute";

import Home from "./components/pages/Home";
import SinglePost from "./components/pages/SinglePost";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import MenuBar from "./components/MenuBar";
import { setContext } from "apollo-link-context";
import Notification from "./components/Notification";

const wsLink = new WebSocketLink({
  uri: "ws://localhost:5000/subscriptions",
  options: {
    reconnect: true,
  },
});

const httpLink = createHttpLink({
  uri: "http://localhost:5000",
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink
);

const authLink = setContext(() => {
  const token = localStorage.getItem("jwtToken");
  return {
    headers: {
      Authorization: token ? `Bearer ${JSON.parse(token)}` : "",
    },
  };
});

const cache = new InMemoryCache({
  typePolicies: {
    Post: {
      fields: {
        likes: {
          merge(_, incoming) {
            return incoming;
          },
        },
        comments: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
    Query: {
      fields: {
        getPosts: {
          merge(_, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  // @ts-ignore
  link: authLink.concat(splitLink),
  cache,
});

function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <Router>
          <Container>
            <MenuBar />
            <Notification />
            <Route exact path="/" component={Home} />
            <AuthRoute exact path="/login" component={Login} />
            <AuthRoute exact path="/register" component={Register} />
            <Route exact path="/posts/:postId" component={SinglePost} />
          </Container>
        </Router>
      </ApolloProvider>
    </AuthProvider>
  );
}

export default App;
