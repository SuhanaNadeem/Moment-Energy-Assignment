const { model, Schema } = require("mongoose");
const { customAlphabet } = require("nanoid");

const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 10);

const voltageMeasurementSchema = new Schema({
  _id: {
    type: String,
    default: () => nanoid(),
  },
  time: Date,
  voltage: Number,
});

module.exports = model("VoltageMeasurement", voltageMeasurementSchema);
