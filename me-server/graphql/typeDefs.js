const { gql } = require("apollo-server");

module.exports = gql`
  scalar DateTime

  type VoltageMeasurement {
    test: String
  }

  type Query {
    getVoltageMeasurements: [VoltageMeasurement]
  }

  type Mutation {
    addVoltageMeasurement: VoltageMeasurement
  }
`;
