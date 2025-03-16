/**
 * Energy Optimization Service
 * Standalone module that can be integrated with the existing Energy Monitor application
 */

const mongoose = require("mongoose")

// Optimization Schema - Create this in a separate file if you prefer
const OptimizationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  applianceId: {
    type: String,
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

// Create model if it doesn't exist
let Optimization
try {
  Optimization = mongoose.model("optimization")
} catch (error) {
  Optimization = mongoose.model("optimization", OptimizationSchema)
}

/**
 * Optimization Service Class
 */
class OptimizationService {
  /**
   * Get optimization recommendations for all appliances
   * @param {string} userId - User ID
   * @param {Array} appliances - Array of appliance objects
   * @param {number} electricityRate - Electricity rate per kWh
   */
  async getOptimizations(userId, appliances, electricityRate = 0.12) {
    if (!appliances || appliances.length === 0) {
      throw new Error("No appliances found")
    }

    // Get recent optimizations
    const recentOptimizations = await Optimization.find({
      userId,
      createdAt: { $gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // Less than 7 days old
    })

    // If we have recent optimizations for all appliances, return them
    if (recentOptimizations.length === appliances.length) {
      return recentOptimizations
    }

    // Generate optimizations for appliances that don't have recent ones
    const optimizations = []

    for (const appliance of appliances) {
      const existingOptimization = recentOptimizations.find((opt) => opt.applianceId === appliance._id.toString())

      if (existingOptimization) {
        optimizations.push(existingOptimization)
      } else {
        const optimization = await this._generateOptimization(userId, appliance, electricityRate)
        optimizations.push(optimization)
      }
    }

    return optimizations
  }

  /**
   * Generate optimization recommendations for a single appliance
   * @private
   */
  async _generateOptimization(userId, appliance, electricityRate) {
    const currentUsage = ((appliance.wattage * appliance.hoursPerDay) / 1000) * 30 // Monthly kWh
    let optimizedUsage, recommendations

    // Apply different optimization strategies based on appliance type and usage patterns
    const applianceType = this._classifyApplianceType(appliance.name)
    const usagePattern = this._analyzeUsagePattern(appliance)

    switch (applianceType) {
      case "refrigerator":
        optimizedUsage = currentUsage * this._getRefrigeratorOptimizationFactor(appliance)
        recommendations = this._getRefrigeratorRecommendations(appliance)
        break
      case "air_conditioner":
        optimizedUsage = currentUsage * this._getACOptimizationFactor(appliance)
        recommendations = this._getACRecommendations(appliance, usagePattern)
        break
      case "washing_machine":
        optimizedUsage = currentUsage * this._getWashingMachineOptimizationFactor(appliance)
        recommendations = this._getWashingMachineRecommendations(appliance)
        break
      case "lighting":
        optimizedUsage = currentUsage * this._getLightingOptimizationFactor(appliance)
        recommendations = this._getLightingRecommendations(appliance)
        break
      default:
        optimizedUsage = currentUsage * 0.85 // Default 15% reduction
        recommendations = [
          "Unplug when not in use to avoid phantom power consumption",
          "Consider upgrading to a more energy-efficient model",
          "Use a smart plug to monitor and control usage",
        ]
    }

    const potentialSavings = Math.round((currentUsage - optimizedUsage) * electricityRate * 100) / 100

    // Create and save the optimization
    const optimization = new Optimization({
      userId,
      applianceId: appliance._id,
      applianceName: appliance.name,
      currentUsage: Math.round(currentUsage * 100) / 100,
      optimizedUsage: Math.round(optimizedUsage * 100) / 100,
      potentialSavings,
      recommendations,
    })

    return optimization.save()
  }

  /**
   * Classify appliance type based on name
   * @private
   */
  _classifyApplianceType(name) {
    const nameLower = name.toLowerCase()

    if (nameLower.includes("refrigerator") || nameLower.includes("fridge")) {
      return "refrigerator"
    } else if (nameLower.includes("air conditioner") || nameLower.includes("ac") || nameLower.includes("a/c")) {
      return "air_conditioner"
    } else if (nameLower.includes("washer") || nameLower.includes("washing")) {
      return "washing_machine"
    } else if (nameLower.includes("light") || nameLower.includes("lamp") || nameLower.includes("bulb")) {
      return "lighting"
    }

    return "other"
  }

  /**
   * Analyze usage pattern of an appliance
   * @private
   */
  _analyzeUsagePattern(appliance) {
    // In a real implementation, this would analyze historical usage data
    // For now, we'll use a simple heuristic based on hours per day

    if (appliance.hoursPerDay >= 20) {
      return "continuous"
    } else if (appliance.hoursPerDay >= 10) {
      return "heavy"
    } else if (appliance.hoursPerDay >= 5) {
      return "moderate"
    } else {
      return "light"
    }
  }

  /**
   * Get optimization factor for refrigerators
   * @private
   */
  _getRefrigeratorOptimizationFactor(appliance) {
    // Refrigerators run continuously, so optimization is limited
    // but still possible through better maintenance and settings
    return 0.9 // 10% reduction potential
  }

  /**
   * Get refrigerator-specific recommendations
   * @private
   */
  _getRefrigeratorRecommendations(appliance) {
    return [
      "Ensure the refrigerator door seals properly",
      "Keep the refrigerator at the optimal temperature (37-40°F)",
      "Clean the coils regularly to improve efficiency",
      "Keep the refrigerator away from heat sources like ovens or direct sunlight",
      "Allow hot foods to cool before placing them in the refrigerator",
    ]
  }

  /**
   * Get optimization factor for air conditioners
   * @private
   */
  _getACOptimizationFactor(appliance) {
    // AC optimization potential depends on usage hours
    if (appliance.hoursPerDay > 12) {
      return 0.75 // 25% reduction potential for heavy usage
    } else {
      return 0.85 // 15% reduction potential for moderate usage
    }
  }

  /**
   * Get AC-specific recommendations
   * @private
   */
  _getACRecommendations(appliance, usagePattern) {
    const recommendations = [
      "Use a programmable thermostat to adjust temperature when not at home",
      "Set the temperature to 78°F in summer to save energy",
      "Clean or replace air filters monthly",
    ]

    if (usagePattern === "heavy" || usagePattern === "continuous") {
      recommendations.push(
        "Consider using ceiling fans to supplement AC and raise the thermostat a few degrees",
        "Use window coverings to block sunlight during the hottest parts of the day",
      )
    }

    return recommendations
  }

  /**
   * Get optimization factor for washing machines
   * @private
   */
  _getWashingMachineOptimizationFactor(appliance) {
    return 0.8 // 20% reduction potential
  }

  /**
   * Get washing machine-specific recommendations
   * @private
   */
  _getWashingMachineRecommendations(appliance) {
    return [
      "Wash clothes in cold water when possible",
      "Run full loads instead of partial loads",
      "Use high-efficiency detergent",
      "Choose the appropriate water level for the load size",
      "Use the high-speed spin setting to reduce drying time",
    ]
  }

  /**
   * Get optimization factor for lighting
   * @private
   */
  _getLightingOptimizationFactor(appliance) {
    return 0.7 // 30% reduction potential
  }

  /**
   * Get lighting-specific recommendations
   * @private
   */
  _getLightingRecommendations(appliance) {
    return [
      "Replace with LED bulbs if not already using them",
      "Install motion sensors in less frequently used areas",
      "Take advantage of natural light during the day",
      "Use task lighting instead of lighting the entire room",
      "Consider smart lighting systems that can be programmed and controlled remotely",
    ]
  }

  /**
   * Get advanced optimization recommendations (placeholder for future enhancement)
   * This would use more sophisticated ML models to analyze patterns
   */
  async getAdvancedOptimizations(userId, appliances, usageHistory) {
    // This is a placeholder for future enhancement
    // In a real implementation, this would use ML models to analyze usage patterns

    // For now, just return the basic optimizations
    return this.getOptimizations(userId, appliances)
  }
}

module.exports = new OptimizationService()

