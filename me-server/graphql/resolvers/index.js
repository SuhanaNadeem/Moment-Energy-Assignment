const voltageMeasurementResolvers = require("./voltageMeasurements");
const { GraphQLDateTime } = require("graphql-iso-date");

module.exports = {
  DateTime: GraphQLDateTime,
  Query: {
    ...voltageMeasurementResolvers.Query,
  },
  Mutation: {
    ...voltageMeasurementResolvers.Mutation,
  },
};
