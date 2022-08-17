import { ApolloProvider } from "@apollo/client";
import React from "react";
import App from "./App";
import { customerClient } from "./GraphqlApolloClients";

export default (
  <ApolloProvider client={customerClient}>
    <App />
  </ApolloProvider>
);
