"use client"

import { useState, useContext, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Form, Modal } from "react-bootstrap"
import { TextField, MenuItem } from "@mui/material"
import EnergyContext from "../../context/EnergyContext"

const Appliances = () => {
  const { appliances, rooms, addAppliance, deleteAppliance, fetchAppliances } = useContext(EnergyContext)
  const [showModal, setShowModal] = useState(false)
  const [newAppliance, setNewAppliance] = useState({
    name: "",
    wattage: "",
    hoursPerDay: "",
    roomId: "",
  })

  useEffect(() => {
    fetchAppliances()
    // eslint-disable-next-line
  }, [])

  const handleInputChange = (e) => {
    setNewAppliance({
      ...newAppliance,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addAppliance(newAppliance)
    setNewAppliance({
      name: "",
      wattage: "",
      hoursPerDay: "",
      roomId: "",
    })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this appliance?")) {
      deleteAppliance(id)
    }
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Appliances</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Appliance
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Wattage</th>
                <th>Hours/Day</th>
                <th>Daily kWh</th>
                <th>Monthly kWh</th>
                <th>Room</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((appliance) => {
                const dailyKwh = (appliance.wattage * appliance.hoursPerDay) / 1000
                const monthlyKwh = dailyKwh * 30
                const room = rooms.find((r) => r._id === appliance.roomId)

                return (
                  <tr key={appliance._id}>
                    <td>{appliance.name}</td>
                    <td>{appliance.wattage} W</td>
                    <td>{appliance.hoursPerDay}</td>
                    <td>{dailyKwh.toFixed(2)}</td>
                    <td>{monthlyKwh.toFixed(2)}</td>
                    <td>{room ? room.name : "N/A"}</td>
                    <td>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(appliance._id)}>
                        Delete
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Appliance Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Appliance</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Appliance Name</Form.Label>
              <Form.Control type="text" name="name" value={newAppliance.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Wattage (W)</Form.Label>
              <Form.Control
                type="number"
                name="wattage"
                value={newAppliance.wattage}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hours Used Per Day</Form.Label>
              <Form.Control
                type="number"
                name="hoursPerDay"
                value={newAppliance.hoursPerDay}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Room</Form.Label>
              <TextField
                select
                fullWidth
                name="roomId"
                value={newAppliance.roomId}
                onChange={handleInputChange}
                required
              >
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    {room.name}
                  </MenuItem>
                ))}
              </TextField>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Appliance
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Appliances

