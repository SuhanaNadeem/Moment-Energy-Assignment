require("dotenv").config();

const { ApolloServer } = require("apollo-server-express");
const { PubSub } = require("graphql-subscriptions");
const express = require("express");

const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers/index");

const pubsub = new PubSub();

const PORT = process.env.PORT || 5000;

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req, connection }) => ({ req, connection, pubsub }),
  });

  await server.start();

  const app = express();

  server.applyMiddleware({ app });

  await new Promise((r) => app.listen({ port: PORT }, r));

  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
}

mongoose
  .connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    startServer();
  });
