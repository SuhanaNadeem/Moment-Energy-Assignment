const { gql } = require("apollo-server");

module.exports = gql`
  scalar DateTime

  type VoltageMeasurement {
    id: String!

    time: DateTime!
    voltage: Float!
  }

  type Query {
    getVoltageMeasurements: [VoltageMeasurement]!
    getLastNVoltageMeasurements(N: Float!): [VoltageMeasurement]!
    getFormattedLastNVoltageMeasurements(timeRange: String!): [[String]]!
  }

  type Mutation {
    createVoltageMeasurementCollection(
      hours: Float!
      interval: Float!
      meanVoltage: Float!
      step: Float!
      minVoltage: Float!
      maxVoltage: Float!
    ): [VoltageMeasurement]!
    addVoltageMeasurement(voltage: Float!, time: DateTime!): VoltageMeasurement!
    deleteVoltageMeasurementById(id: String!): String
    deleteAllVoltageMeasurements: String
  }
`;
