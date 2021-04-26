const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const pubSub = new PubSub();

const server = new ApolloServer({
  subscriptions: {
    path: "/subscriptions",
  },
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubSub }),
});

mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`MongoDB connected`);
    return server.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });
