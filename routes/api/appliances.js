const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")

const Appliance = require("../../models/Appliance")
const User = require("../../models/User")

// @route   GET api/appliances
// @desc    Get all appliances for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const appliances = await Appliance.find({ user: req.user.id }).sort({ date: -1 })
    res.json(appliances)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/appliances
// @desc    Add a new appliance
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("name", "Name is required").not().isEmpty(),
      check("wattage", "Wattage is required").isNumeric(),
      check("hoursPerDay", "Hours per day is required").isNumeric(),
      check("roomId", "Room ID is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    try {
      const { name, wattage, hoursPerDay, roomId } = req.body

      const newAppliance = new Appliance({
        name,
        wattage,
        hoursPerDay,
        roomId,
        user: req.user.id,
      })

      const appliance = await newAppliance.save()

      res.json(appliance)
    } catch (err) {
      console.error(err.message)
      res.status(500).send("Server Error")
    }
  },
)

// @route   DELETE api/appliances/:id
// @desc    Delete an appliance
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id)

    if (!appliance) {
      return res.status(404).json({ msg: "Appliance not found" })
    }

    // Check user
    if (appliance.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    await appliance.remove()

    res.json({ msg: "Appliance removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Appliance not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router

