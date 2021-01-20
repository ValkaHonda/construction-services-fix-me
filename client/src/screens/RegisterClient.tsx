import React from 'react'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'

export const RegisterClient = (props: any) => {
  const [formState, setFormState] = React.useState({})
  const goToLogin = () => props.history.push('/login')

  const handleSubmit = (e: any) => {
    e.preventDefault()
    fetch('http://localhost:3008/api/auth/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formState),
    })
      .then((res) => res.json())
      .then(goToLogin)
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
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Потребителско име</Form.Label>
                  <Form.Control required type="text" name="username" placeholder="Потребителско име" />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Парола</Form.Label>
                  <Form.Control required type="password" name="password" placeholder="Парола" />
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPassword">
                  <Form.Label>Повторете паролата</Form.Label>
                  <Form.Control required type="password" name="confirmPassword" placeholder="Повторете паролата" />
                </Form.Group>
                <Form.Group controlId="formBasicFirstName">
                  <Form.Label>Име</Form.Label>
                  <Form.Control required type="text" name="firstName" placeholder="Име" />
                </Form.Group>
                <Form.Group controlId="formBasicLastName">
                  <Form.Label>Фамилно име</Form.Label>
                  <Form.Control required type="text" name="lastName" placeholder="Фамилно име" />
                </Form.Group>
                <Form.Group controlId="formBasicConfirmPhone">
                  <Form.Label>Телефон</Form.Label>
                  <Form.Control required type="number" name="phone" placeholder="Телефон" />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Регистрирай
                </Button>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
