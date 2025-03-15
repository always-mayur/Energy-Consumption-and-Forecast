"use client"

import { useContext, useEffect, useState } from "react"
import { Container, Row, Col, Card, Table, Form } from "react-bootstrap"
import { Bar } from "react-chartjs-2"
import EnergyContext from "../../context/EnergyContext"

const CostCalculation = () => {
  const { appliances, rooms, fetchAppliances, fetchRooms } = useContext(EnergyContext)
  const [electricityRate, setElectricityRate] = useState(0.12) // Default rate in $ per kWh

  useEffect(() => {
    fetchAppliances()
    fetchRooms()
    // eslint-disable-next-line
  }, [])

  const calculateApplianceCost = (appliance) => {
    const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
    const monthlyKwh = dailyKwh * 30
    return monthlyKwh * electricityRate
  }

  const calculateRoomCost = (roomId) => {
    const roomAppliances = appliances.filter((a) => a.roomId === roomId)
    return roomAppliances.reduce((total, appliance) => {
      return total + calculateApplianceCost(appliance)
    }, 0)
  }

  const totalMonthlyCost = appliances.reduce((total, appliance) => {
    return total + calculateApplianceCost(appliance)
  }, 0)

  // Prepare chart data for room costs
  const roomCostData = {
    labels: rooms.map((room) => room.name),
    datasets: [
      {
        label: "Monthly Cost ($)",
        data: rooms.map((room) => calculateRoomCost(room._id)),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  }

  // Prepare chart data for appliance costs
  const applianceCostData = {
    labels: appliances.map((appliance) => appliance.name),
    datasets: [
      {
        label: "Monthly Cost ($)",
        data: appliances.map((appliance) => calculateApplianceCost(appliance)),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <Container>
      <h1 className="mb-4">Cost Calculation</h1>

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Electricity Rate</Card.Title>
              <Form.Group>
                <Form.Label>Rate per kWh ($)</Form.Label>
                <Form.Control
                  type="number"
                  step="0.01"
                  value={electricityRate}
                  onChange={(e) => setElectricityRate(Number.parseFloat(e.target.value))}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Total Monthly Cost</Card.Title>
              <h2 className="text-primary">${totalMonthlyCost.toFixed(2)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Room Costs</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar
                  data={roomCostData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Appliance Costs</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar
                  data={applianceCostData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Detailed Cost Breakdown</Card.Title>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Appliance</th>
                    <th>Room</th>
                    <th>Daily Usage (hours)</th>
                    <th>Monthly Usage (kWh)</th>
                    <th>Monthly Cost ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {appliances.map((appliance) => {
                    const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
                    const monthlyKwh = dailyKwh * 30
                    const monthlyCost = calculateApplianceCost(appliance)
                    const room = rooms.find((r) => r._id === appliance.roomId)

                    return (
                      <tr key={appliance._id}>
                        <td>{appliance.name}</td>
                        <td>{room ? room.name : "N/A"}</td>
                        <td>{appliance.hoursPerDay}</td>
                        <td>{monthlyKwh.toFixed(2)}</td>
                        <td>${monthlyCost.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default CostCalculation

