"use client"

import { useContext } from "react"
import { Button, Container, Nav, Navbar } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const MainNavbar = () => {
  const { isAuthenticated, logout, user } = useContext(AuthContext)
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate("/")
  }

  const authLinks = (
    <>
      <Nav.Link as={Link} to="/dashboard">
        Dashboard
      </Nav.Link>
      <Nav.Link as={Link} to="/appliances">
        Appliances
      </Nav.Link>
      <Nav.Link as={Link} to="/rooms">
        Rooms
      </Nav.Link>
      <Nav.Link as={Link} to="/cost">
        Cost
      </Nav.Link>
      <Nav.Link as={Link} to="/budget">
        Budget
      </Nav.Link>
      <Nav.Link as={Link} to="/advanced-forecasting">
        Advanced Forecasting
      </Nav.Link> {/* Added link */}
      <Nav.Link as={Link} to="/advanced-optimization">
        Advanced Optimization
      </Nav.Link> {/* Added link */}
      <Nav.Item className="d-flex align-items-center me-auto ">
        <span className="text-light me-2">Hello, {user && user.name}</span>
        <Button variant="outline-light" size="sm" onClick={onLogout}>
          Logout
        </Button>
      </Nav.Item>
    </>
  )

  const guestLinks = (
    <>
      <Nav.Link as={Link} to="/login">
        Login
      </Nav.Link>
      <Nav.Link as={Link} to="/register">
        Register
      </Nav.Link>
    </>
  )

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <i className="fas fa-bolt me-2"></i>
          EnergyMonitor
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {isAuthenticated && authLinks}
          </Nav>
          <Nav>{!isAuthenticated && guestLinks}</Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MainNavbar

