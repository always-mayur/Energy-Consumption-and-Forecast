"use client"

import { useState, useContext, useEffect } from "react"
import { Container, Row, Col, Card, Button, Table, Form, Modal } from "react-bootstrap"
import { Pie } from "react-chartjs-2"
import EnergyContext from "../../context/EnergyContext"

const Rooms = () => {
  const { rooms, addRoom, deleteRoom, fetchRooms, getRoomConsumption } = useContext(EnergyContext)
  const [showModal, setShowModal] = useState(false)
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchRooms()
    // eslint-disable-next-line
  }, [])

  const handleInputChange = (e) => {
    setNewRoom({
      ...newRoom,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addRoom(newRoom)
    setNewRoom({
      name: "",
      description: "",
    })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      deleteRoom(id)
    }
  }

  // Prepare chart data
  const roomConsumptionData = {
    labels: rooms.map((room) => room.name),
    datasets: [
      {
        data: rooms.map((room) => getRoomConsumption(room._id)),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1>Rooms</h1>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add New Room
          </Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Appliances</th>
                    <th>Consumption (kWh/month)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room._id}>
                      <td>{room.name}</td>
                      <td>{room.description}</td>
                      <td>{room.applianceCount || 0}</td>
                      <td>{getRoomConsumption(room._id).toFixed(2)}</td>
                      <td>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(room._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Room Energy Distribution</Card.Title>
              <div style={{ height: "300px" }}>
                <Pie
                  data={roomConsumptionData}
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

      {/* Add Room Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Room Name</Form.Label>
              <Form.Control type="text" name="name" value={newRoom.name} onChange={handleInputChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Room
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  )
}

export default Rooms

