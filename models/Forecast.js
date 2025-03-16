const mongoose = require("mongoose")

const ForecastSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  forecastType: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  predictions: [
    {
      date: Date,
      consumption: Number,
      cost: Number,
    },
  ],
  accuracy: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("forecast", ForecastSchema)

