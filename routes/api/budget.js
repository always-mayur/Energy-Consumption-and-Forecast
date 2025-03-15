const express = require("express")
const router = express.Router()
const auth = require("../../middleware/auth")
const { check, validationResult } = require("express-validator")

const User = require("../../models/User")

// @route   POST api/budget
// @desc    Set budget
// @access  Private
router.post("/", [auth, [check("amount", "Amount is required").isNumeric()]], async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }

  try {
    const { amount } = req.body

    // Update user budget
    const user = await User.findByIdAndUpdate(req.user.id, { budget: amount }, { new: true })

    res.json({ amount: user.budget })
  } catch (err) {
    console.error(err.message)
    res.status(500).send("Server Error")
  }
})

module.exports = router

