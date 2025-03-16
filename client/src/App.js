import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom"
import theme from "./theme"

// Components
import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Footer from "./components/layout/Footer"
import Navbar from "./components/layout/Navbar"
import AdvancedForecasting from "./components/pages/AdvancedForecasting"; // Added import
import AdvancedOptimization from "./components/pages/AdvancedOptimization"; // Added import
import Appliances from "./components/pages/Appliances"
import Budget from "./components/pages/Budget"
import CostCalculation from "./components/pages/CostCalculation"
import Dashboard from "./components/pages/Dashboard"
import Home from "./components/pages/Home"
import Rooms from "./components/pages/Rooms"

// Context
import PrivateRoute from "./components/routing/PrivateRoute"
import { AuthProvider } from "./context/AuthContext"
import { EnergyProvider } from "./context/EnergyContext"

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
                <Route
                  path="/advanced-forecasting"
                  element={
                    <PrivateRoute>
                      <AdvancedForecasting />
                    </PrivateRoute>
                  }
                /> {/* Added route */}
                <Route
                  path="/advanced-optimization"
                  element={
                    <PrivateRoute>
                      <AdvancedOptimization />
                    </PrivateRoute>
                  }
                /> {/* Added route */}
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

