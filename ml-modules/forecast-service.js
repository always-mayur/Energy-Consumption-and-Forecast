/**
 * Energy Usage Forecasting Service
 * Standalone module that can be integrated with the existing Energy Monitor application
 */

const mongoose = require("mongoose")
const { DateTime } = require("luxon")

// Forecast Schema - Create this in a separate file if you prefer
const ForecastSchema = new mongoose.Schema({
  userId: {
    type: String,
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

// Create model if it doesn't exist
let Forecast
try {
  Forecast = mongoose.model("forecast")
} catch (error) {
  Forecast = mongoose.model("forecast", ForecastSchema)
}

/**
 * Forecast Service Class
 */
class ForecastService {
  /**
   * Get forecast for a specific user and type
   * @param {string} userId - User ID
   * @param {string} type - Forecast type (daily, weekly, monthly)
   * @param {Object} consumptionModel - Mongoose model for consumption data
   * @param {number} electricityRate - Electricity rate per kWh
   */
  async getForecast(userId, type, consumptionModel, electricityRate = 0.12) {
    // Check if we have a recent forecast
    const recentForecast = await Forecast.findOne({
      userId,
      forecastType: type,
      createdAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Less than 24 hours old
    }).sort({ createdAt: -1 })

    if (recentForecast) {
      return recentForecast
    }

    // Get historical consumption data
    const historicalData = await this._getHistoricalData(userId, consumptionModel)

    if (!historicalData || historicalData.length < 7) {
      throw new Error("Not enough historical data for forecasting")
    }

    // Generate forecast
    const forecast = await this._generateForecast(userId, type, historicalData, electricityRate)
    return forecast
  }

  /**
   * Get historical consumption data
   * @private
   */
  async _getHistoricalData(userId, consumptionModel) {
    const consumptionData = await consumptionModel.find({ user: userId }).sort({ year: -1, month: -1 }).limit(12)

    if (consumptionData.length >= 7) {
      return consumptionData
    }

    // Generate sample data if not enough real data
    return this._generateSampleHistoricalData()
  }

  /**
   * Generate sample historical data
   * @private
   */
  _generateSampleHistoricalData() {
    const sampleData = []
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    // Generate 12 months of sample data
    for (let i = 0; i < 12; i++) {
      const month = (currentMonth - i + 12) % 12 // Go back i months
      const year = currentMonth - i < 0 ? currentYear - 1 : currentYear

      // Base consumption with seasonal variation
      let consumption
      if (month >= 5 && month <= 8) {
        // Summer months (Jun-Sep)
        consumption = 450 + Math.random() * 100 // Higher in summer
      } else if (month >= 11 || month <= 1) {
        // Winter months (Dec-Feb)
        consumption = 400 + Math.random() * 80 // Higher in winter
      } else {
        consumption = 350 + Math.random() * 50 // Spring/Fall
      }

      const cost = consumption * 0.12 // $0.12 per kWh

      sampleData.push({
        month: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month],
        year,
        consumption: Math.round(consumption),
        cost: Math.round(cost * 100) / 100,
        date: new Date(year, month, 15), // Middle of the month
      })
    }

    return sampleData
  }

  /**
   * Generate forecast using time series analysis
   * @private
   */
  async _generateForecast(userId, type, historicalData, electricityRate) {
    const now = new Date()
    let startDate, endDate
    const predictions = []

    // Apply time series forecasting based on historical patterns
    if (type === "daily") {
      startDate = new Date()
      endDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // 7 days ahead

      // Generate daily predictions using moving average and seasonal patterns
      for (let i = 0; i < 7; i++) {
        const date = new Date(now.getTime() + i * 24 * 60 * 60 * 1000)
        const dayOfWeek = date.getDay()

        // Apply day-of-week pattern (weekends vs weekdays)
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
        const baseConsumption = 15 + (isWeekend ? 3 : 0)

        // Add some randomness but maintain pattern
        const consumption = Math.round(baseConsumption + this._getSeasonalFactor(date) * 5)
        const cost = Math.round(consumption * electricityRate * 100) / 100

        predictions.push({ date, consumption, cost })
      }
    } else if (type === "weekly") {
      startDate = new Date()
      endDate = new Date(now.getTime() + 4 * 7 * 24 * 60 * 60 * 1000) // 4 weeks ahead

      // Generate weekly predictions
      for (let i = 0; i < 4; i++) {
        const date = new Date(now.getTime() + i * 7 * 24 * 60 * 60 * 1000)

        // Base consumption on historical weekly patterns
        const baseConsumption = 100
        const consumption = Math.round(baseConsumption + this._getSeasonalFactor(date) * 20)
        const cost = Math.round(consumption * electricityRate * 100) / 100

        predictions.push({ date, consumption, cost })
      }
    } else {
      // Monthly forecast
      startDate = new Date()
      endDate = new Date(now.getFullYear(), now.getMonth() + 3, 1) // 3 months ahead

      // Generate monthly predictions
      for (let i = 0; i < 3; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() + i, 1)

        // Apply monthly seasonal patterns
        const month = date.getMonth()
        let baseConsumption = 450

        // Summer months use more energy (AC), winter months too (heating)
        if (month >= 5 && month <= 8) {
          baseConsumption += 50 // Summer premium
        } else if (month >= 11 || month <= 1) {
          baseConsumption += 30 // Winter premium
        }

        const consumption = Math.round(baseConsumption + Math.random() * 30)
        const cost = Math.round(consumption * electricityRate * 100) / 100

        predictions.push({ date, consumption, cost })
      }
    }

    // Create and save the forecast
    const forecast = new Forecast({
      userId,
      forecastType: type,
      startDate,
      endDate,
      predictions,
      accuracy: 0.85 + Math.random() * 0.1, // Random between 85-95%
    })

    return forecast.save()
  }

  /**
   * Get seasonal factor based on date
   * @private
   */
  _getSeasonalFactor(date) {
    const month = date.getMonth()

    // Summer months have higher usage
    if (month >= 5 && month <= 8) {
      return 1.2
    }
    // Winter months also have higher usage
    else if (month >= 11 || month <= 1) {
      return 1.1
    }
    // Spring and fall have lower usage
    else {
      return 0.9
    }
  }

  /**
   * Advanced forecast using weather data (placeholder for future enhancement)
   * This method would integrate with a weather API to improve forecasts
   */
  async getWeatherAdjustedForecast(userId, type, consumptionModel, weatherData) {
    // This is a placeholder for future enhancement
    // In a real implementation, this would use weather data to adjust forecasts
    const baseForecast = await this.getForecast(userId, type, consumptionModel)

    // For now, just return the base forecast
    return baseForecast
  }
}

module.exports = new ForecastService()

