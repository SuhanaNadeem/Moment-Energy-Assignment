const { gql } = require("apollo-server");

module.exports = gql`
  scalar DateTime

  type VoltageMeasurement {
    id: String!

    time: DateTime!
    voltage: Float!
  }

  type Query {
    getVoltageMeasurements: [VoltageMeasurement]
  }

  type Mutation {
    createVoltageMeasurementCollection(hours: Float!): [VoltageMeasurement]!
    addVoltageMeasurement(voltage: Float!, time: DateTime!): VoltageMeasurement!
    deleteVoltageMeasurementById(id: String!): String
  }
`;
