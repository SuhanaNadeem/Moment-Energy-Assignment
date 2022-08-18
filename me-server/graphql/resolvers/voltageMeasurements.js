const { UserInputError } = require("apollo-server-express");
const VoltageMeasurement = require("../../models/VoltageMeasurement");
const moment = require("moment");
module.exports = {
  Query: {
    async getVoltageMeasurements(_, {}) {
      const voltageMeasurements = await VoltageMeasurement.find();
      return voltageMeasurements;
    },
    async getFormattedLastNVoltageMeasurements(_, { timeRange }) {
      let N;
      switch (timeRange) {
        case "1m":
          N = 60;
          break;
        case "15m":
          N = 15 * 60;
          break;
        case "1h":
          N = 3600;
          break;
        case "6h":
          N = 6 * 3600;
          break;
        case "12h":
          N = 12 * 3600;
          break;
        default:
          throw new UserInputError("Invalid time range!");
      }

      const lastNVoltageMeasurements =
        await module.exports.Query.getLastNVoltageMeasurements(_, { N });

      const formattedLastNVoltageMeasurements = [["Time", "Voltage"]];

      for (let voltageMeasurement of lastNVoltageMeasurements) {
        formattedLastNVoltageMeasurements.push([
          moment(voltageMeasurement.time).format("hh:mm:ss"),
          String(voltageMeasurement.voltage),
        ]);
      }
      console.log(formattedLastNVoltageMeasurements);
      return formattedLastNVoltageMeasurements;
    },
    async getLastNVoltageMeasurements(_, { N }) {
      if (N <= 0) {
        throw new UserInputError("N must be a positive value");
      }
      // N is in seconds
      let endDateTime = "2022-08-18T11:59:45.000Z";
      let startDateTime = moment(endDateTime).subtract(N, "seconds").toDate();

      console.log("N ", N);
      console.log("startDateTime ", startDateTime);
      console.log("endDateTime ", endDateTime);

      const voltageMeasurements = await VoltageMeasurement.find();

      const lastNVoltageMeasurements = [];
      let momentTime;
      let time;
      for (let voltageMeasurement of voltageMeasurements) {
        time = voltageMeasurement.time;
        momentTime = moment(time);
        if (momentTime.isBetween(startDateTime, endDateTime, null, "[]")) {
          lastNVoltageMeasurements.push(voltageMeasurement);
        }
      }

      console.log("Returning from here:");
      console.log(lastNVoltageMeasurements);
      return lastNVoltageMeasurements;
    },
  },
  Mutation: {
    async createVoltageMeasurementCollection(
      _,
      { hours, interval, meanVoltage, step, minVoltage, maxVoltage }
    ) {
      let dateTime = new Date("2022-08-18");
      const seconds = hours * 3600;
      let newVoltageMeasurement;
      let newDateTime;
      let voltage = meanVoltage;
      let decrease = false;
      let increase = true;
      for (let i = 0; i < seconds; i += interval) {
        newVoltageMeasurement =
          await module.exports.Mutation.addVoltageMeasurement(_, {
            time: dateTime,
            voltage,
          });
        if (decrease) {
          voltage -= step;
        } else {
          voltage += step;
        }
        // switch direction of wave if peak or trough is reached
        if (voltage === maxVoltage) {
          decrease = true;
          increase = false;
        } else if (voltage === minVoltage) {
          increase = true;
          decrease = false;
        }
        newDateTime = moment(dateTime).add(interval, "seconds").toDate();
        dateTime = newDateTime;
      }
      const voltageMeasurements =
        await module.exports.Query.getVoltageMeasurements(_, {});
      return voltageMeasurements;
    },
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
      return "Deleted one!";
    },
    async deleteAllVoltageMeasurements(_, {}) {
      await VoltageMeasurement.deleteMany();
      return "Deleted many!";
    },
  },
};
