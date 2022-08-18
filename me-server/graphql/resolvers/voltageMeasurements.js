const { UserInputError } = require("apollo-server-express");
const VoltageMeasurement = require("../../models/VoltageMeasurement");
const moment = require("moment");
module.exports = {
  Query: {
    async getVoltageMeasurements(_, {}) {
      const voltageMeasurements = await VoltageMeasurement.find();
      return voltageMeasurements;
    },
    async getLastNVoltageMeasurements(_, { N }) {
      if (N <= 0) {
        throw new UserInputError("N must be a positive value");
      }
      // N is in seconds
      let endDateTime = moment("2022-08-18T11:59:45.000Z");
      let startDateTime = moment(endDateTime).subtract(N, "seconds").toDate();
      // var compareDate = moment("2022-08-18T00:00:15.000Z");
      // console.log(compareDate.isBetween(startDateTime, endDateTime));

      console.log("start datetime: ", startDateTime);
      console.log("end datetime: ", endDateTime);

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
