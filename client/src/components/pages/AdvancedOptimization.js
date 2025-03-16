"use client"

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Alert, Badge, Button, Card, Col, Container, Form, ProgressBar, Row, Spinner } from "react-bootstrap"
import AuthContext from "../../context/AuthContext"

const AdvancedOptimization = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const [optimizations, setOptimizations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [electricityRate, setElectricityRate] = useState(0.12)
  const [showImplemented, setShowImplemented] = useState({})

  useEffect(() => {
    if (isAuthenticated) {
      fetchOptimizations()
    }
  }, [isAuthenticated])

  const fetchOptimizations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axios.get("/api/ml/optimization")
      setOptimizations(res.data)

      // Initialize implementation tracking
      const implementedState = {}
      res.data.forEach((opt) => {
        implementedState[opt._id] = false
      })
      setShowImplemented(implementedState)
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch optimization data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchOptimizations()
  }

  const handleRateChange = (e) => {
    setElectricityRate(Number.parseFloat(e.target.value))
  }

  const toggleImplemented = (id) => {
    setShowImplemented((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Calculate total potential savings with current electricity rate
  const calculateSavings = (opt) => {
    const kwhSaved = opt.currentUsage - opt.optimizedUsage
    return (kwhSaved * electricityRate).toFixed(2)
  }

  const totalSavings = optimizations.reduce((total, opt) => {
    return total + Number.parseFloat(calculateSavings(opt))
  }, 0)

  // Calculate annual savings
  const annualSavings = (totalSavings * 12).toFixed(2)

  return (
    <Container>
      <h1 className="mb-4">Advanced Energy Optimization</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Potential Savings</Card.Title>
              <h3 className="text-success">${totalSavings.toFixed(2)}/month</h3>
              <p className="text-muted mb-0">${annualSavings}/year</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Electricity Rate</Card.Title>
              <Form.Group>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={electricityRate}
                  onChange={handleRateChange}
                />
                <Form.Text className="text-muted">$ per kWh</Form.Text>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3} className="mb-4 mb-lg-0">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Energy Reduction</Card.Title>
              <h3>
                {optimizations.length > 0
                  ? Math.round(
                      (optimizations.reduce((total, opt) => total + (opt.currentUsage - opt.optimizedUsage), 0) /
                        optimizations.reduce((total, opt) => total + opt.currentUsage, 0)) *
                        100,
                    )
                  : 0}
                %
              </h3>
              <p className="text-muted mb-0">Potential monthly reduction</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} lg={3}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center">
              <Button variant="primary" onClick={handleRefresh} disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : "Refresh Recommendations"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Row>
          {optimizations.map((optimization) => (
            <Col md={6} className="mb-4" key={optimization._id}>
              <Card>
                <Card.Body>
                  <Card.Title className="d-flex justify-content-between align-items-center">
                    {optimization.applianceName}
                    <Badge bg="success">${calculateSavings(optimization)} Savings</Badge>
                  </Card.Title>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Current: {optimization.currentUsage.toFixed(2)} kWh</span>
                      <span>Target: {optimization.optimizedUsage.toFixed(2)} kWh</span>
                    </div>
                    <ProgressBar className="mt-2">
                      <ProgressBar
                        variant="success"
                        now={optimization.optimizedUsage}
                        max={optimization.currentUsage}
                        key={1}
                      />
                      <ProgressBar
                        variant="danger"
                        now={optimization.currentUsage - optimization.optimizedUsage}
                        max={optimization.currentUsage}
                        key={2}
                      />
                    </ProgressBar>
                    <div className="text-end mt-1">
                      <small className="text-muted">
                        {Math.round(
                          ((optimization.currentUsage - optimization.optimizedUsage) / optimization.currentUsage) * 100,
                        )}
                        % reduction
                      </small>
                    </div>
                  </div>

                  <h6>Recommendations:</h6>
                  <ul>
                    {optimization.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant={showImplemented[optimization._id] ? "outline-success" : "outline-primary"}
                      size="sm"
                      onClick={() => toggleImplemented(optimization._id)}
                    >
                      {showImplemented[optimization._id] ? "Implemented ✓" : "Mark as Implemented"}
                    </Button>

                    <Button variant="outline-secondary" size="sm">
                      View Details
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>About Advanced Energy Optimization</Card.Title>
              <p>
                Our advanced energy optimization system uses machine learning algorithms to analyze your appliance usage
                patterns and identify opportunities for energy savings. The recommendations are based on:
              </p>
              <ul>
                <li>Detailed analysis of your specific usage patterns</li>
                <li>Comparison with similar households in your area</li>
                <li>Energy efficiency standards and best practices</li>
                <li>Seasonal adjustments for optimal performance</li>
                <li>Cost-benefit analysis of potential upgrades</li>
              </ul>
              <p>
                By implementing these recommendations, you can significantly reduce your energy consumption and save
                money on your electricity bill while also reducing your environmental impact. The system continuously
                learns from your usage patterns to provide increasingly accurate and personalized recommendations over
                time.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdvancedOptimization

