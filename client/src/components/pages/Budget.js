"use client"

import { useState, useContext, useEffect } from "react"
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap"
import { CircularProgress, Typography, Box } from "@mui/material"
import EnergyContext from "../../context/EnergyContext"

const Budget = () => {
  const { totalCost, fetchDashboardData, budget, setBudget } = useContext(EnergyContext)
  const [showAlert, setShowAlert] = useState(false)
  const [newBudget, setNewBudget] = useState(budget || 100)

  useEffect(() => {
    fetchDashboardData()
    // eslint-disable-next-line
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    setBudget(newBudget)
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 3000)
  }

  // Calculate percentage of budget used
  const budgetPercentage = budget ? (totalCost / budget) * 100 : 0
  const isOverBudget = budgetPercentage > 100

  return (
    <Container>
      <h1 className="mb-4">Budget Settings</h1>

      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Budget updated successfully!
        </Alert>
      )}

      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Set Monthly Budget</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Monthly Budget ($)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number.parseFloat(e.target.value))}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Save Budget
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Body className="text-center">
              <Card.Title>Budget Status</Card.Title>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={Math.min(budgetPercentage, 100)}
                  size={120}
                  thickness={5}
                  color={isOverBudget ? "error" : "primary"}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: "absolute",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${Math.round(budgetPercentage)}%`}
                  </Typography>
                </Box>
              </Box>
              <div className="mt-3">
                <h4>
                  ${totalCost.toFixed(2)} / ${budget}
                </h4>
                {isOverBudget && (
                  <Alert variant="danger" className="mt-3">
                    You have exceeded your monthly budget!
                  </Alert>
                )}
                {budgetPercentage > 80 && budgetPercentage <= 100 && (
                  <Alert variant="warning" className="mt-3">
                    You are approaching your monthly budget limit!
                  </Alert>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Budget Tips</Card.Title>
              <ul>
                <li>Consider replacing old appliances with energy-efficient models.</li>
                <li>Unplug devices when not in use to reduce phantom power consumption.</li>
                <li>Use LED bulbs instead of incandescent bulbs to save energy.</li>
                <li>Run large appliances like washing machines during off-peak hours.</li>
                <li>Adjust your thermostat by a few degrees to save on heating/cooling costs.</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Budget

