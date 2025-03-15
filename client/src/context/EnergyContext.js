"use client"

import { createContext, useState } from "react"
import axios from "axios"

const EnergyContext = createContext()

export const EnergyProvider = ({ children }) => {
  const [appliances, setAppliances] = useState([])
  const [rooms, setRooms] = useState([])
  const [totalConsumption, setTotalConsumption] = useState(0)
  const [totalCost, setTotalCost] = useState(0)
  const [monthlyData, setMonthlyData] = useState([])
  const [applianceData, setApplianceData] = useState([])
  const [roomData, setRoomData] = useState([])
  const [budget, setBudgetState] = useState(100)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/dashboard")
      setTotalConsumption(res.data.totalConsumption)
      setTotalCost(res.data.totalCost)
      setMonthlyData(res.data.monthlyData)
      setApplianceData(res.data.applianceData)
      setRoomData(res.data.roomData)
      return res.data
    } catch (err) {
      console.error(err)
      // For now, set sample data
      setSampleDashboardData()
    }
  }

  // Fetch appliances
  const fetchAppliances = async () => {
    try {
      const res = await axios.get("/api/appliances")
      setAppliances(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      // For now, set sample data
      setSampleApplianceData()
    }
  }

  // Add appliance
  const addAppliance = async (applianceData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/appliances", applianceData, config)
      setAppliances([...appliances, res.data])
      return res.data
    } catch (err) {
      console.error(err)
      // For now, add to sample data
      const newAppliance = {
        _id: Date.now().toString(),
        ...applianceData,
        wattage: Number.parseInt(applianceData.wattage),
        hoursPerDay: Number.parseFloat(applianceData.hoursPerDay),
      }
      setAppliances([...appliances, newAppliance])
    }
  }

  // Delete appliance
  const deleteAppliance = async (id) => {
    try {
      await axios.delete(`/api/appliances/${id}`)
      setAppliances(appliances.filter((appliance) => appliance._id !== id))
    } catch (err) {
      console.error(err)
      // For now, remove from sample data
      setAppliances(appliances.filter((appliance) => appliance._id !== id))
    }
  }

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      const res = await axios.get("/api/rooms")
      setRooms(res.data)
      return res.data
    } catch (err) {
      console.error(err)
      // For now, set sample data
      setSampleRoomData()
    }
  }

  // Add room
  const addRoom = async (roomData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/rooms", roomData, config)
      setRooms([...rooms, res.data])
      return res.data
    } catch (err) {
      console.error(err)
      // For now, add to sample data
      const newRoom = {
        _id: Date.now().toString(),
        ...roomData,
        applianceCount: 0,
      }
      setRooms([...rooms, newRoom])
    }
  }

  // Delete room
  const deleteRoom = async (id) => {
    try {
      await axios.delete(`/api/rooms/${id}`)
      setRooms(rooms.filter((room) => room._id !== id))
    } catch (err) {
      console.error(err)
      // For now, remove from sample data
      setRooms(rooms.filter((room) => room._id !== id))
    }
  }

  // Get room consumption
  const getRoomConsumption = (roomId) => {
    const roomAppliances = appliances.filter((a) => a.roomId === roomId)
    return roomAppliances.reduce((total, appliance) => {
      const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
      const monthlyKwh = dailyKwh * 30
      return total + monthlyKwh
    }, 0)
  }

  // Set budget
  const setBudget = async (amount) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    }

    try {
      const res = await axios.post("/api/budget", { amount }, config)
      setBudgetState(res.data.amount)
      return res.data
    } catch (err) {
      console.error(err)
      // For now, just set the state
      setBudgetState(amount)
    }
  }

  // Sample data functions for development
  const setSampleDashboardData = () => {
    setTotalConsumption(450)
    setTotalCost(54)
    setMonthlyData([
      { month: "Jan", consumption: 420, cost: 50.4 },
      { month: "Feb", consumption: 380, cost: 45.6 },
      { month: "Mar", consumption: 450, cost: 54 },
      { month: "Apr", consumption: 470, cost: 56.4 },
      { month: "May", consumption: 520, cost: 62.4 },
      { month: "Jun", consumption: 480, cost: 57.6 },
    ])
    setApplianceData([
      { name: "Refrigerator", consumption: 150 },
      { name: "Air Conditioner", consumption: 100 },
      { name: "Washing Machine", consumption: 80 },
      { name: "TV", consumption: 60 },
      { name: "Lights", consumption: 40 },
      { name: "Computer", consumption: 20 },
    ])
    setRoomData([
      { name: "Living Room", consumption: 180 },
      { name: "Kitchen", consumption: 150 },
      { name: "Bedroom", consumption: 80 },
      { name: "Bathroom", consumption: 40 },
    ])
  }

  const setSampleApplianceData = () => {
    setAppliances([
      { _id: "1", name: "Refrigerator", wattage: 150, hoursPerDay: 24, roomId: "1" },
      { _id: "2", name: "Air Conditioner", wattage: 1500, hoursPerDay: 8, roomId: "1" },
      { _id: "3", name: "Washing Machine", wattage: 500, hoursPerDay: 1, roomId: "2" },
      { _id: "4", name: "TV", wattage: 100, hoursPerDay: 5, roomId: "1" },
      { _id: "5", name: "Lights", wattage: 60, hoursPerDay: 6, roomId: "3" },
      { _id: "6", name: "Computer", wattage: 200, hoursPerDay: 8, roomId: "3" },
    ])
  }

  const setSampleRoomData = () => {
    setRooms([
      { _id: "1", name: "Living Room", description: "Main living area", applianceCount: 3 },
      { _id: "2", name: "Kitchen", description: "Cooking area", applianceCount: 1 },
      { _id: "3", name: "Bedroom", description: "Master bedroom", applianceCount: 2 },
      { _id: "4", name: "Bathroom", description: "Main bathroom", applianceCount: 0 },
    ])
  }

  return (
    <EnergyContext.Provider
      value={{
        appliances,
        rooms,
        totalConsumption,
        totalCost,
        monthlyData,
        applianceData,
        roomData,
        budget,
        fetchDashboardData,
        fetchAppliances,
        addAppliance,
        deleteAppliance,
        fetchRooms,
        addRoom,
        deleteRoom,
        getRoomConsumption,
        setBudget,
      }}
    >
      {children}
    </EnergyContext.Provider>
  )
}

export default EnergyContext

