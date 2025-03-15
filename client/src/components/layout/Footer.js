import { Facebook, Instagram, YouTube } from "@mui/icons-material"
import { IconButton } from "@mui/material"
import { Col, Container, Row } from "react-bootstrap"

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          
          <Col md={3}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/" className="text-light">
                  Home
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-light">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/appliances" className="text-light">
                  Appliances
                </a>
              </li>
            </ul>
          </Col>

          <Col md={6}>
            <h5>EnergyMonitor</h5>
            <p>Monitor and manage your home energy consumption efficiently.</p>
          </Col>

          <Col md={3} className="connect">
            <h5>Connect With Us</h5>
            <div>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="YouTube">
                <YouTube />
              </IconButton>
            </div>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col className="text-center">
            <p className="mb-0">&copy; {new Date().getFullYear()} EnergyMonitor. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

