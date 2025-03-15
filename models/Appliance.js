const mongoose = require("mongoose")

const ApplianceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    required: true,
  },
  wattage: {
    type: Number,
    required: true,
  },
  hoursPerDay: {
    type: Number,
    required: true,
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "room",
  },
  date: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("appliance", ApplianceSchema)

