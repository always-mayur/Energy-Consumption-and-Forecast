"use client"

import { useContext, useEffect } from "react"
import { Container, Row, Col, Card } from "react-bootstrap"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import EnergyContext from "../../context/EnergyContext"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement)

const Dashboard = () => {
  const { totalConsumption, totalCost, monthlyData, applianceData, roomData, fetchDashboardData } =
    useContext(EnergyContext)

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line
  }, [])

  // Monthly consumption chart data
  const monthlyChartData = {
    labels: monthlyData.map((item) => item.month),
    datasets: [
      {
        label: "Energy Consumption (kWh)",
        data: monthlyData.map((item) => item.consumption),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "Cost ($)",
        data: monthlyData.map((item) => item.cost),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  }

  // Appliance consumption chart data
  const applianceChartData = {
    labels: applianceData.map((item) => item.name),
    datasets: [
      {
        label: "Consumption (kWh)",
        data: applianceData.map((item) => item.consumption),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  // Room consumption chart data
  const roomChartData = {
    labels: roomData.map((item) => item.name),
    datasets: [
      {
        label: "Consumption (kWh)",
        data: roomData.map((item) => item.consumption),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Container>
      <h1 className="mb-4">Energy Dashboard</h1>

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>{totalConsumption} kWh</h3>
              <Card.Text>Total Consumption</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>${totalCost}</h3>
              <Card.Text>Total Cost</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>{applianceData.length}</h3>
              <Card.Text>Appliances</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100 text-center">
            <Card.Body>
              <h3>{roomData.length}</h3>
              <Card.Text>Rooms</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={8} className="mb-4 mb-lg-0">
          <Card>
            <Card.Body>
              <Card.Title>Monthly Energy Consumption</Card.Title>
              <div style={{ height: "300px" }}>
                <Line
                  data={monthlyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                  }}
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card>
            <Card.Body>
              <Card.Title>Room Distribution</Card.Title>
              <div style={{ height: "300px" }}>
                <Doughnut
                  data={roomChartData}
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
              <Card.Title>Appliance Consumption</Card.Title>
              <div style={{ height: "300px" }}>
                <Bar
                  data={applianceChartData}
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
    </Container>
  )
}

export default Dashboard

