import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

export const Register = (props: any) => {
  const goToClientRegister = () => props.history.push('/register-client')
  const goToCompanyRegister = () => props.history.push('/register-company')
  return (
    <div className="app-entry-background">
      <Container className="login-register">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button onClick={goToClientRegister} variant="success" size="lg">
              Регистрирай Клиент
            </Button>
          </Col>
          <Col md="auto">
            <Button onClick={goToCompanyRegister} variant="danger" size="lg">
              Регистрирай Компания
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
