const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")

const Room = require("../../models/Room")
const Appliance = require("../../models/Appliance")
const User = require("../../models/User")

// @route   GET api/rooms
// @desc    Get all rooms for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find({ user: req.user.id }).sort({ date: -1 })

    // Get appliance count for each room
    const roomsWithCount = await Promise.all(
      rooms.map(async (room) => {
        const applianceCount = await Appliance.countDocuments({
          user: req.user.id,
          roomId: room._id,
        })

        return {
          ...room._doc,
          applianceCount,
        }
      }),
    )

    res.json(roomsWithCount)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   POST api/rooms
// @desc    Add a new room
// @access  Private
router.post("/", [auth, [check("name", "Name is required").not().isEmpty()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { name, description } = req.body

    const newRoom = new Room({
      name,
      description,
      user: req.user.id,
    })

    const room = await newRoom.save()

    res.json(room)
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

// @route   DELETE api/rooms/:id
// @desc    Delete a room
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)

    if (!room) {
      return res.status(404).json({ msg: "Room not found" })
    }

    // Check user
    if (room.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" })
    }

    // Check if room has appliances
    const applianceCount = await Appliance.countDocuments({
      user: req.user.id,
      roomId: room._id,
    })

    if (applianceCount > 0) {
      return res.status(400).json({ msg: "Cannot delete room with appliances" })
    }

    await room.remove()

    res.json({ msg: "Room removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Room not found" })
    }
    res.status(500).send("Server Error")
  }
})

module.exports = router

