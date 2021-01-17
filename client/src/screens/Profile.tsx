import React from 'react'
import { Card, Col, Container, ListGroup, ListGroupItem, Row, Spinner } from 'react-bootstrap'
import { getClientToken } from '../utils'

export const Profile = () => {
  const [clientData, setClientData] = React.useState<any>({})
  React.useEffect(() => {
    const clientFromStorage = getClientToken()
    if (clientFromStorage) {
      setClientData(clientFromStorage)
      console.log({ clientFromStorage })
    }
  }, [])
  const { user } = clientData

  if (!user) {
    return (
      <Spinner animation="border" role="status">
        <span className="sr-only">Loading...</span>
      </Spinner>
    )
  }
  return (
    <div className="form-applications">
      <div>
        <Container>
          <Row className="justify-content-md-center">
            <Col md="12" className="form-background">
              <div className="d-flex">
                <Card style={{ width: '30rem' }}>
                  <Card.Img variant="top" src={user.avatarURL} />
                  <Card.Body>
                    <Card.Title className="font-weight-bold">{user.username}</Card.Title>
                    <Card.Text>{`${user.firstName} ${user.lastName}`}</Card.Text>
                  </Card.Body>
                  <ListGroup>
                    <ListGroupItem>
                      <span>
                        <img height="15px" width="15px" src="https://cdn.onlinewebfonts.com/svg/img_501721.png" />
                      </span>
                      <span style={{ marginLeft: '5px' }}>{user.email}</span>
                    </ListGroupItem>
                    <ListGroupItem>
                      <span>
                        <img height="15px" width="15px" src="https://www.clipartmax.com/png/middle/38-381602_png-file-svg-land-phone-icon-png.png" />
                      </span>
                      <span style={{ marginLeft: '5px' }}>{user.phone}</span>
                    </ListGroupItem>
                  </ListGroup>
                  <Card.Body>
                    <Card.Link href="#">Разгледай</Card.Link>
                    <Card.Link href="#">Харесани</Card.Link>
                    <Card.Link href="#">Твои</Card.Link>
                    <Card.Link href="#">Създай</Card.Link>
                  </Card.Body>
                </Card>
                <div>Some additional info</div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}
