const express = require("express")
const connectDB = require("./config/db")
const path = require("path")
const passport = require("passport")
const session = require("express-session")
const cors = require("cors")

// Initialize Express
const app = express()

// Connect Database
connectDB()

// Initialize Middleware
app.use(express.json({ extended: false }))
app.use(cors())

// Express session
app.use(
  session({
    secret: "energy-monitor-secret",
    resave: false,
    saveUninitialized: false,
  }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Passport config
require("./config/passport")(passport)

// Set up EJS
app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

// Define Routes
app.use("/api/users", require("./routes/api/users"))
app.use("/api/auth", require("./routes/api/auth"))
app.use("/api/appliances", require("./routes/api/appliances"))
app.use("/api/rooms", require("./routes/api/rooms"))
app.use("/api/dashboard", require("./routes/api/dashboard"))
app.use("/api/budget", require("./routes/api/budget"))

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send("Server Error")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

