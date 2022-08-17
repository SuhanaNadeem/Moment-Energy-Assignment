const { UserInputError } = require("apollo-server-express");
const VoltageMeasurement = require("../../models/VoltageMeasurement");

module.exports = {
  Query: {
    async getVoltageMeasurements(_, {}) {
      const voltageMeasurements = await VoltageMeasurement.find();
      return voltageMeasurements;
    },
  },
  Mutation: {
    async addVoltageMeasurement(_, { voltage, time }) {
      const voltageMeasurements = await VoltageMeasurement.find({
        time,
      });
      if (voltageMeasurements && voltageMeasurements.length !== 0) {
        throw new UserInputError(
          "A Voltage Measurement with this time already exists"
        );
      }
      const newVoltageMeasurement = new VoltageMeasurement({
        voltage,
        time,
      });
      await newVoltageMeasurement.save();
      return newVoltageMeasurement;
    },
    async deleteVoltageMeasurementById(_, { id }) {
      const voltageMeasurement = await VoltageMeasurement.findById(id);
      if (!voltageMeasurement) {
        throw new UserInputError(
          "A Voltage Measurement with this id does not exist"
        );
      }
      await VoltageMeasurement.deleteOne({ _id: id });
      return "Deleted!";
    },
  },
};
