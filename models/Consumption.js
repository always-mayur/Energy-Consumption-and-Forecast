const mongoose = require("mongoose")

const ConsumptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  appliance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appliance",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  energyConsumed: {
    type: Number,
    required: true,
  },
})

module.exports = mongoose.model("consumption", ConsumptionSchema)