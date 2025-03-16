/**
 * ML API Routes
 * This file contains routes for the ML features
 */

const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const forecastService = require("../../ml-modules/forecast-service")
const optimizationService = require("../../ml-modules/optimization-service")

// Import models
const Appliance = require("../../models/Appliance")
const Consumption = require("../../models/consumption") // Updated path to match the file name

// @route   GET api/ml/forecast/:type
// @desc    Get energy usage forecast
// @access  Private
router.get("/forecast/:type", auth, async (req, res) => {
  try {
    const { type } = req.params

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return res.status(400).json({ msg: "Invalid forecast type" })
    }

    const forecast = await forecastService.getForecast(
      req.user.id,
      type,
      Consumption,
      0.12, // Default electricity rate
    )

    res.json(forecast)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/ml/optimization
// @desc    Get appliance usage optimization recommendations
// @access  Private
router.get("/optimization", auth, async (req, res) => {
  try {
    // Get appliances
    const appliances = await Appliance.find({ user: req.user.id })

    if (!appliances || appliances.length === 0) {
      return res.status(400).json({ msg: "No appliances found" })
    }

    const optimizations = await optimizationService.getOptimizations(
      req.user.id,
      appliances,
      0.12, // Default electricity rate
    )

    res.json(optimizations)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   GET api/ml/forecast/weather/:type
// @desc    Get weather-adjusted energy usage forecast (advanced feature)
// @access  Private
router.get("/forecast/weather/:type", auth, async (req, res) => {
  try {
    const { type } = req.params

    if (!["daily", "weekly", "monthly"].includes(type)) {
      return res.status(400).json({ msg: "Invalid forecast type" })
    }

    // This would normally fetch weather data from an API
    // For now, we'll just use the regular forecast
    const forecast = await forecastService.getForecast(req.user.id, type, Consumption, 0.12)

    res.json(forecast)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

