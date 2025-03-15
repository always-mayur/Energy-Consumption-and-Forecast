import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "./theme"

// Components
import Navbar from "./components/layout/Navbar"
import Footer from "./components/layout/Footer"
import Home from "./components/pages/Home"
import Dashboard from "./components/pages/Dashboard"
import Appliances from "./components/pages/Appliances"
import Rooms from "./components/pages/Rooms"
import CostCalculation from "./components/pages/CostCalculation"
import Budget from "./components/pages/Budget"
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"

// Context
import { AuthProvider } from "./context/AuthContext"
import { EnergyProvider } from "./context/EnergyContext"
import PrivateRoute from "./components/routing/PrivateRoute"

function App() {
  return (
    <AuthProvider>
      <EnergyProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router>
            <Navbar />
            <div className="container mt-4 mb-5">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/appliances"
                  element={
                    <PrivateRoute>
                      <Appliances />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/rooms"
                  element={
                    <PrivateRoute>
                      <Rooms />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/cost"
                  element={
                    <PrivateRoute>
                      <CostCalculation />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/budget"
                  element={
                    <PrivateRoute>
                      <Budget />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </div>
            <Footer />
          </Router>
        </ThemeProvider>
      </EnergyProvider>
    </AuthProvider>
  )
}

export default App

