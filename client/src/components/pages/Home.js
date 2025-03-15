import { Calculate as CalculateIcon, FlashOn as FlashOnIcon, Lightbulb as LightbulbIcon } from "@mui/icons-material"
import { Button, Card, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const Home = () => {
  return (
    <Container>
      <Row className="mb-5">
        <Col md={12} className="text-center">
          <h1 className="display-4 mb-4">Welcome to EnergyMonitor</h1>
          <p className="lead">
            Monitor, analyze, and optimize your home energy consumption with our comprehensive tools.
          </p>
          <div className="mt-4">
            <Button as={Link} to="/register" variant="primary" size="lg" className="me-3">
              Get Started
            </Button>
            <Button as={Link} to="/login" variant="outline-primary" size="lg">
              Login
            </Button>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={12}>
          <h2 className="text-center mb-4">How It Works</h2>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <FlashOnIcon style={{ fontSize: 60, color: "#1976d2" }} />
              <Card.Title className="mt-3">Track Energy Usage</Card.Title>
              <Card.Text>Monitor your energy consumption in real-time and identify usage patterns.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <CalculateIcon style={{ fontSize: 60, color: "#1976d2" }} />
              <Card.Title className="mt-3">Calculate Costs</Card.Title>
              <Card.Text>Understand the cost implications of your energy usage and set budgets.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 text-center">
            <Card.Body>
              <LightbulbIcon style={{ fontSize: 60, color: "#1976d2" }} />
              <Card.Title className="mt-3">Get Insights</Card.Title>
              <Card.Text>Receive personalized recommendations to reduce energy consumption and save money.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <img
            src="/home.jpg" // Update this path to a valid image URL
            alt="Energy monitoring dashboard"
            className="img-fluid rounded shadow"
          />
        </Col>
        <Col md={6}>
          <h2>Take Control of Your Energy Usage</h2>
          <br></br>
          <p>
            EnergyMonitor provides a comprehensive solution for monitoring and managing your home's energy consumption.
            With our intuitive dashboard, you can:
          </p>
          
          <ul>
            <li>Track energy usage by appliance and room</li> 
            <br></br>
            <li>Set budget alerts to avoid bill surprises</li>
            <br></br>
            <li>Analyze consumption patterns with detailed charts</li>
            <br></br>
            <li>Get personalized recommendations to reduce usage</li>
            <br></br>
          </ul>
          &nbsp;
          <Button as={Link} to="/register" variant="primary">
            Start Monitoring Today
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

export default Home

