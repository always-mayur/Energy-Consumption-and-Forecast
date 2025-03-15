"use client"

import axios from "axios"
import { createContext, useEffect, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  // Set auth token
  if (token) {
    axios.defaults.headers.common["x-auth-token"] = token
  } else {
    delete axios.defaults.headers.common["x-auth-token"]
  }

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/auth")
          setUser(res.data)
          setIsAuthenticated(true)
        } catch (err) {
          localStorage.removeItem("token")
          setToken(null)
          setUser(null)
          setIsAuthenticated(false)
        }
      }
      setLoading(false)
    }

    loadUser()
  }, [token])

  // Register user
  const register = async (name, email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const body = JSON.stringify({ name, email, password })

    try {
      const res = await axios.post("/api/users", body, config)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Login user
  const login = async (email, password) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    const body = JSON.stringify({ email, password })

    try {
      const res = await axios.post("/api/auth", body, config)
      localStorage.setItem("token", res.data.token)
      setToken(res.data.token)
      return res.data
    } catch (err) {
      throw err
    }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

