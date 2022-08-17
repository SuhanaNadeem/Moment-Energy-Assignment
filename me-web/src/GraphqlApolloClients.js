import { split } from "@apollo/client";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";

const backendURI ="http://localhost:5000/graphql";

const wsURI = "ws://localhost:5000/graphql";

const httpLink = createUploadLink({
  uri: backendURI,
});

const wsLink = new WebSocketLink({
  uri: wsURI,
  options: {
    reconnect: true,
    lazy: true,
    onError: (error) => {
      if (
        error.message.contains("authorization") &&
        
          localStorage.getItem("customerJwtToken")
      ) {
        wsLink.subscriptionClient.close(false, false);
      }
    },
    connectionParams: () => ({
      CustomerAuth: `Bearer ${localStorage.getItem("customerJwtToken")}`,
    }),
  },
});

const customerAuthLink = setContext(() => {
  const customerToken = localStorage.getItem("customerJwtToken");
  return {
    headers: {
      Authorization: customerToken ? `Bearer ${customerToken}` : "",
    },
  };
});

const customerLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  customerAuthLink.concat(httpLink)
);

export const customerClient = new ApolloClient({
  link: customerLink,
  uri: backendURI,
  cache: new InMemoryCache(),
});