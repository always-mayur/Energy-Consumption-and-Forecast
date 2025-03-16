const mongoose = require("mongoose")

const OptimizationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  applianceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "appliance",
    required: true,
  },
  applianceName: {
    type: String,
    required: true,
  },
  currentUsage: {
    type: Number,
    required: true,
  },
  optimizedUsage: {
    type: Number,
    required: true,
  },
  potentialSavings: {
    type: Number,
    required: true,
  },
  recommendations: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("optimization", OptimizationSchema)

