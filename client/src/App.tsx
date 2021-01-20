import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

function App(props: any) {
  const goToLogin = () => props.history.push('/login-client')
  const goToRegister = () => props.history.push('/register-client')

  return (
    <div className="app-entry-background">
      <Container className="login-register">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button onClick={goToLogin} variant="success" size="lg">
              Влезни
            </Button>
          </Col>
          <Col md="auto">
            <Button onClick={goToRegister} variant="danger" size="lg">
              Регистрирай се
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default App
