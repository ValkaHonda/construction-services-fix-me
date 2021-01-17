import React from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'

export const Login = (props: any) => {
  const goToClientLogin = () => props.history.push('/login-client')
  const goToCompanyLogin = () => props.history.push('/login-company')
  return (
    <div className="app-entry-background">
      <Container className="login-register">
        <Row className="justify-content-md-center">
          <Col md="auto">
            <Button onClick={goToClientLogin} variant="success" size="lg">
              Влезни като Клиент
            </Button>
          </Col>
          <Col md="auto">
            <Button onClick={goToCompanyLogin} variant="danger" size="lg">
              Влезни като Компания
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
