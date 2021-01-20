import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { saveClientToken } from '../utils'

export const LoginClient = (props: any) => {
  const [formState, setFormState] = React.useState({})
  const goToProfile = (res: any) => {
    saveClientToken(res)
    props.history.push('/profile')
  }

  const handleSubmit = (e: any) => {
    e.preventDefault()
    fetch('http://localhost:3008/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then(goToProfile)
      .catch((err) => console.log(err))
  }

  const handleChange = (e: any) => {
    setFormState((prevState) => ({ ...prevState, [e.target.name]: e.target.value }))
  }
  return (
    <div className="form-applications">
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="4" className="form-background">
              <Form className="form" onChange={handleChange} onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Имейл</Form.Label>
                  <Form.Control required type="email" name="email" placeholder="Имейл" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Парола</Form.Label>
                  <Form.Control required type="password" name="password" placeholder="Парола" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Влезни
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
