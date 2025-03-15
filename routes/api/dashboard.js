const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")

const Appliance = require("../../models/Appliance")
const Room = require("../../models/Room")
const User = require("../../models/User")

// @route   GET api/dashboard
// @desc    Get dashboard data
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const appliances = await Appliance.find({ user: req.user.id })
    const rooms = await Room.find({ user: req.user.id })
    const user = await User.findById(req.user.id)

    // Calculate total consumption and cost
    let totalConsumption = 0
    let totalCost = 0
    const electricityRate = 0.12 // Default rate in $ per kWh

    appliances.forEach((appliance) => {
      const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
      const monthlyKwh = dailyKwh * 30
      totalConsumption += monthlyKwh
      totalCost += monthlyKwh * electricityRate
    })

    // Generate monthly data (sample for now)
    const monthlyData = [
      { month: "Jan", consumption: Math.round(totalConsumption * 0.9), cost: Math.round(totalCost * 0.9 * 100) / 100 },
      {
        month: "Feb",
        consumption: Math.round(totalConsumption * 0.85),
        cost: Math.round(totalCost * 0.85 * 100) / 100,
      },
      {
        month: "Mar",
        consumption: Math.round(totalConsumption * 0.95),
        cost: Math.round(totalCost * 0.95 * 100) / 100,
      },
      {
        month: "Apr",
        consumption: Math.round(totalConsumption * 1.05),
        cost: Math.round(totalCost * 1.05 * 100) / 100,
      },
      { month: "May", consumption: Math.round(totalConsumption * 1.1), cost: Math.round(totalCost * 1.1 * 100) / 100 },
      { month: "Jun", consumption: Math.round(totalConsumption), cost: Math.round(totalCost * 100) / 100 },
    ]

    // Generate appliance data
    const applianceData = appliances.map((appliance) => {
      const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
      const monthlyKwh = dailyKwh * 30
      return {
        name: appliance.name,
        consumption: Math.round(monthlyKwh * 100) / 100,
      }
    })

    // Generate room data
    const roomData = await Promise.all(
      rooms.map(async (room) => {
        const roomAppliances = appliances.filter((a) => a.roomId.toString() === room._id.toString())
        const consumption = roomAppliances.reduce((total, appliance) => {
          const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
          const monthlyKwh = dailyKwh * 30
          return total + monthlyKwh
        }, 0)

        return {
          name: room.name,
          consumption: Math.round(consumption * 100) / 100,
        }
      }),
    )

    res.json({
      totalConsumption: Math.round(totalConsumption),
      totalCost: Math.round(totalCost * 100) / 100,
      monthlyData,
      applianceData,
      roomData,
      budget: user.budget,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

