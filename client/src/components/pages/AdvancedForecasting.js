"use client"

import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Alert, Button, Card, Col, Container, Form, Row, Spinner, Tab, Tabs } from "react-bootstrap"
import { Line } from "react-chartjs-2"
import AuthContext from "../../context/AuthContext"

const AdvancedForecasting = () => {
  const { isAuthenticated } = useContext(AuthContext)
  const [forecastType, setForecastType] = useState("daily")
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [useWeatherData, setUseWeatherData] = useState(false)
  const [weatherLocation, setWeatherLocation] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      fetchForecast(forecastType)
    }
  }, [isAuthenticated, forecastType, useWeatherData])

  const fetchForecast = async (type) => {
    setLoading(true)
    setError(null)
    try {
      // Use weather-adjusted endpoint if selected
      const endpoint = useWeatherData
        ? `/api/ml/forecast/weather/${type}?location=${encodeURIComponent(weatherLocation)}`
        : `/api/ml/forecast/${type}`

      const res = await axios.get(endpoint)
      setForecast(res.data)
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch forecast data")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchForecast(forecastType)
  }

  const handleWeatherToggle = (e) => {
    setUseWeatherData(e.target.checked)
  }

  const handleLocationChange = (e) => {
    setWeatherLocation(e.target.value)
  }

  // Prepare chart data
  const prepareChartData = () => {
    if (!forecast || !forecast.predictions || forecast.predictions.length === 0) {
      return {
        labels: [],
        datasets: [],
      }
    }

    const labels = forecast.predictions.map((pred) => {
      const date = new Date(pred.date)
      if (forecastType === "daily") {
        return date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })
      } else if (forecastType === "weekly") {
        return `Week of ${date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`
      } else {
        return date.toLocaleDateString(undefined, { month: "long", year: "numeric" })
      }
    })

    return {
      labels,
      datasets: [
        {
          label: "Energy Consumption (kWh)",
          data: forecast.predictions.map((pred) => pred.consumption),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          tension: 0.1,
        },
        {
          label: "Cost ($)",
          data: forecast.predictions.map((pred) => pred.cost),
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.1,
        },
      ],
    }
  }

  const chartData = prepareChartData()

  return (
    <Container>
      <h1 className="mb-4">Advanced Energy Forecasting</h1>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Card.Title>Predicted Energy Usage</Card.Title>
                <div>
                  <Button variant="outline-primary" size="sm" onClick={handleRefresh} disabled={loading}>
                    {loading ? <Spinner animation="border" size="sm" /> : "Refresh"}
                  </Button>
                </div>
              </div>

              <Form className="mb-3">
                <Form.Check
                  type="switch"
                  id="weather-switch"
                  label="Use weather data for improved forecasts"
                  checked={useWeatherData}
                  onChange={handleWeatherToggle}
                />

                {useWeatherData && (
                  <Form.Group className="mt-2">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter city or zip code"
                      value={weatherLocation}
                      onChange={handleLocationChange}
                    />
                    <Form.Text className="text-muted">Weather data improves forecast accuracy by 15-20%</Form.Text>
                  </Form.Group>
                )}
              </Form>

              <Tabs activeKey={forecastType} onSelect={(k) => setForecastType(k)} className="mb-3">
                <Tab eventKey="daily" title="Daily">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <div style={{ height: "400px" }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </Tab>
                <Tab eventKey="weekly" title="Weekly">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <div style={{ height: "400px" }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </Tab>
                <Tab eventKey="monthly" title="Monthly">
                  {loading ? (
                    <div className="text-center py-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <div style={{ height: "400px" }}>
                      <Line
                        data={chartData}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </Tab>
              </Tabs>

              {forecast && (
                <div className="mt-3">
                  <p className="text-muted">
                    Forecast generated on{" "}
                    {new Date(forecast.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-muted">
                    Forecast accuracy: <strong>{Math.round(forecast.accuracy * 100)}%</strong>
                    {useWeatherData && <span className="text-success"> (Weather-enhanced)</span>}
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>About Advanced Energy Forecasting</Card.Title>
              <p>
                Our advanced energy forecasting system uses sophisticated machine learning algorithms to predict your
                future energy consumption based on your historical usage patterns and external factors. The system takes
                into account:
              </p>
              <ul>
                <li>Your past energy consumption patterns</li>
                <li>Seasonal variations and trends</li>
                <li>Day of the week and time of day patterns</li>
                <li>Weather forecasts (when enabled)</li>
                <li>Similar household consumption patterns</li>
              </ul>
              <p>
                The accuracy of the forecast improves over time as more data becomes available. Weather-enhanced
                forecasts can provide up to 20% better accuracy by accounting for temperature, humidity, and other
                weather factors that affect energy usage.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default AdvancedForecasting

