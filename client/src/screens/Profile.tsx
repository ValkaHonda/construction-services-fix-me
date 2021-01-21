import React from 'react'
import { Badge, Button, Card, Carousel, Col, Container, Form, ListGroup, ListGroupItem, Modal, Row, Spinner } from 'react-bootstrap'
import ImageUploader from 'react-images-upload'
import { getClientToken } from '../utils'

export const Profile = () => {
  const [clientData, setClientData] = React.useState<any>({})
  const [openCreateCompanyModal, toggleOpenCreateCompanyModal] = React.useState(false)
  const [fetching, setFetching] = React.useState(false)
  const [receivedCompanies, setReceivedCompanies] = React.useState<any>([])
  const [mounted, setMounted] = React.useState(false)

  const toggleFetch = () => setFetching((prevState) => !prevState)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const clientFromStorage = getClientToken()
    if (clientFromStorage) {
      setClientData(clientFromStorage)
    }
  }, [])
  const { user, token } = clientData
  React.useEffect(() => {
    mounted &&
      fetch('http://localhost:3008/api/users/company', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          console.log({ resultFromServerCompanies: res })
          setReceivedCompanies(res)
        })
        .catch((err) => console.log(err))
  }, [fetching, mounted])

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
                    <Card.Link onClick={toggleFetch} href="#">
                      Разгледай
                    </Card.Link>
                    {/* <Card.Link onClick={toggleFetch} href="#">
                      Харесани
                    </Card.Link>
                    <Card.Link onClick={toggleFetch} href="#">
                      Твои
                    </Card.Link> */}
                    <Card.Link onClick={() => toggleOpenCreateCompanyModal(true)} href="#">
                      Създай
                    </Card.Link>
                  </Card.Body>
                </Card>
                <div className="w-100">
                  <RenderCompanies token={token} view="Всички компании" companies={receivedCompanies} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <CreateCompanyModal onCompanyCreation={toggleFetch} token={token} show={openCreateCompanyModal} onHide={() => toggleOpenCreateCompanyModal(false)} />
      </div>
    </div>
  )
}

const RenderCompanies = (props: any) => {
  const [formState, setFormState] = React.useState<any>({})
  const [selectedCompanyId, setSelectedCompanyId] = React.useState<any>({})

  const onCompanyClick = (id: string) => () => {
    setSelectedCompanyId(id)
  }

  const handleChange = (e: any) => {
    if (e.target.name === '') {
      return
    }
    setFormState((prevState: any) => ({ ...prevState, [e.target.name]: e.target.value }))
  }
  const { companies = [] } = props

  const filterBy = (property: string) => (company: any) => {
    if (!formState[property]) {
      return true
    }
    return company[property].toLowerCase().includes(formState[property].toLowerCase())
  }

  const filteredCompanies = companies.filter(filterBy('name')).filter(filterBy('address')).filter(filterBy('creator'))

  const selectedCompany = filteredCompanies.find((currentCompany: any) => currentCompany.id === selectedCompanyId)

  return (
    <Form onChange={handleChange}>
      <h1 style={{ textAlign: 'center' }}>{props.view}</h1>
      <div style={{ paddingLeft: '10px', paddingRight: '20px' }} className="d-flex justify-content-between">
        <div>
          <h4>Име</h4>
          <Form.Control style={{ width: '80px' }} type="text" name="name" placeholder="Име" />
        </div>
        <div style={{ paddingLeft: '70px' }}>
          <h4>Адрес</h4>
          <Form.Control style={{ width: '80px' }} type="text" name="address" placeholder="Адрес" />
        </div>
        <div>
          <h4 style={{ paddingLeft: '40px' }}>Собственик</h4>
          <Form.Control style={{ width: '100px', marginLeft: '70px' }} type="text" name="creator" placeholder="username" />
        </div>
      </div>
      <ListGroup className="company-data-list" style={{ maxHeight: '588px', overflow: 'scroll' }}>
        {filteredCompanies &&
          filteredCompanies.map((company: any) => (
            <ListGroup.Item onClick={onCompanyClick(company.id)} className="hovered-company" key={company.id}>
              <div className="company-data-row">
                <div className="company-data-column" style={{ justifyContent: 'left' }}>
                  {company.name}
                </div>
                <div className="company-data-column center-item">{company.address}</div>
                <div className="company-data-column" style={{ justifyContent: 'right' }}>
                  {company.creator}
                </div>
              </div>
            </ListGroup.Item>
          ))}
      </ListGroup>
      <ViewCompanyModal token={props.token} selectedCompany={selectedCompany} onHide={() => setSelectedCompanyId('')} />
    </Form>
  )
}

const ViewCompanyModal = (props: any) => {
  const { selectedCompany = {}, ...rest } = props
  const { name, images = [], services = [], description, address, phone, email } = selectedCompany
  const [liked, setLiked] = React.useState(false)
  const [totalLikes, setTotalLikes] = React.useState(0)
  const [newCommentValue, setNewCommentValue] = React.useState('')
  const [selectedCompanyComments, setSelectedCompanyComments] = React.useState<any>([])

  React.useEffect(() => {
    selectedCompany && selectedCompany.id && fetchComments()
  }, [selectedCompany])

  React.useEffect(() => {
    selectedCompany &&
      selectedCompany.id &&
      fetch(`http://localhost:3008/api/users/company/like/${selectedCompany.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${props.token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setLiked(res.like)
          setTotalLikes(res.totalLikes)
        })
        .catch((err) => console.log(err))
  }, [selectedCompany])

  const toggleLikeService = () => {
    fetch(`http://localhost:3008/api/users/company/like/${selectedCompany.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((res) => res.json())
      .catch((err) => console.log(err))
  }

  const fetchComments = () => {
    fetch(`http://localhost:3008/api/users/company/comment/${selectedCompany.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setSelectedCompanyComments(res))
      .catch((err) => console.log(err))
  }

  const onSubmitComment = () => {
    fetch(`http://localhost:3008/api/users/company/comment/${selectedCompany.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify({ content: newCommentValue }),
    })
      .then((res) => res.json())
      .then((res: {}) => {
        setSelectedCompanyComments([res, ...selectedCompanyComments])
        console.log({ res })
      })
      .catch((err) => console.log(err))
  }

  return (
    <Modal {...rest} show={!!props.selectedCompany} className="custom-modal" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <Carousel>
            {images.map((image: any) => (
              <Carousel.Item key={image.id}>
                <img className="d-block w-100" height="500px" src={image.url} alt="First slide" />
                <Carousel.Caption>
                  <h3>{description}</h3>
                  <p>{address}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </div>
        <div className="my-3 d-flex justify-content-between">
          <div>
            <span>
              <img height="15px" width="15px" src="https://cdn.onlinewebfonts.com/svg/img_501721.png" />
            </span>
            <span style={{ marginLeft: '5px', marginRight: '20px' }}>{email}</span>
            <span>
              <img height="15px" width="15px" src="https://www.clipartmax.com/png/middle/38-381602_png-file-svg-land-phone-icon-png.png" />
            </span>
            <span style={{ marginLeft: '5px' }}>{phone}</span>
          </div>
          <div className="d-flex">
            {services.map((service: any) => (
              <h5 style={{ marginRight: '10px' }} key={service.id}>
                {service.name} <Badge variant="success">{service.price} лв.</Badge>
              </h5>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-between">
          {liked ? (
            <Button
              onClick={() => {
                setLiked(false)
                setTotalLikes((prevState) => prevState - 1)
                toggleLikeService()
              }}
              variant="danger"
            >
              Спри да харесваш
            </Button>
          ) : (
            <Button
              onClick={() => {
                setLiked(true)
                setTotalLikes((prevState) => prevState + 1)
                toggleLikeService()
              }}
              variant="success"
            >
              Харесай
            </Button>
          )}
          <div>Общ брой харесвания: {totalLikes}</div>
        </div>
        <div className="d-flex">
          <Form.Control value={newCommentValue} onChange={(e: any) => setNewCommentValue(e.target.value)} className="my-2" as="textarea" rows={1} placeholder="Оставете коментар" />
          <Button onClick={onSubmitComment} className="ml-2 align-self-center" variant="secondary">
            Коментирай
          </Button>
        </div>
        <div className="d-flex flex-wrap">
          {selectedCompanyComments.map((comment: any) => {
            const givenDate = new Date(comment.dateCreated)
            const year = givenDate.getFullYear()
            const mes = givenDate.getMonth() + 1
            const dia = givenDate.getDate()
            const prettyDate = dia + '-' + mes + '-' + year
            return (
              <Card key={comment.dateCreated} style={{ width: '20rem', marginRight: '10px' }}>
                <Card.Body>
                  <Card.Title className="font-weight-bold">
                    {comment.user} <img height="20px" width="20px" src={comment.userAvatarURL} />
                  </Card.Title>
                  <Card.Text>{comment.content}</Card.Text>
                  <Card.Text>{prettyDate}</Card.Text>
                </Card.Body>
              </Card>
            )
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            props.onHide()
          }}
        >
          Затвори
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const CreateCompanyModal = (props: any) => {
  const [services, setServices] = React.useState<any>([])
  const [stage, setStage] = React.useState(0)
  const [formState, setFormState] = React.useState<any>({})
  const [pictures, setPictures] = React.useState<any>([])
  const [priceByServiceIds, setPriceByServiceIds] = React.useState<any>({})

  const onDrop = (picture: any) => {
    setPictures(picture)
  }

  const removePictureByName = (name: string) => () => {
    setPictures((prevState: any) => prevState.filter((file: any) => file.name !== name))
  }

  console.log({
    formState,
    pictures,
    priceByServiceIds,
  })

  React.useEffect(() => {
    fetch('http://localhost:3008/api/users/services', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((res) => res.json())
      .then(setServices)
      .catch((err) => console.log(err))
  }, [])

  const handleChange = (e: any) => {
    if (e.target.name === '') {
      return
    }
    if (e.target.name === 'services') {
      const selectedServiceIds = Array.from(e.target.selectedOptions).map((option: any) => option.value)
      setFormState((prevState: any) => ({ ...prevState, [e.target.name]: selectedServiceIds.map((serviceId: any) => services.find(({ id }: any) => id === serviceId)) }))
    } else {
      setFormState((prevState: any) => ({ ...prevState, [e.target.name]: e.target.value }))
    }
  }

  const createCompany = () => {
    const dataToSend = { ...formState, priceByServiceIds }

    fetch('http://localhost:3008/api/users/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${props.token}`,
      },
      body: JSON.stringify(dataToSend),
    })
      .then((res) => res.json())
      .then((res) => {
        const { id } = res
        const formData = new FormData()
        for (const currentPicture of pictures) {
          formData.append('files[]', currentPicture, currentPicture.name)
        }

        fetch(`http://localhost:3008/api/users/company/images/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${props.token}`,
          },
          body: formData,
        })
          .then((res) => res.json())
          .then((res) => {
            console.log({ lastRes: res })
            setStage(0)
            props.onHide()
            setFormState({})
            setPictures([])
            setPriceByServiceIds({})
            props.onCompanyCreation()
          })
      })
      .catch((err) => console.log(err))
  }

  const renderStageOne = () => (
    <Form onChange={handleChange} className="form">
      <Form.Group controlId="formBasicName">
        <Form.Label>Име</Form.Label>
        <Form.Control required type="text" name="name" placeholder="Име" />
      </Form.Group>
      <Form.Group controlId="formBasicDescription">
        <Form.Label>Детайли</Form.Label>
        <Form.Control required as="textarea" name="description" rows={1} placeholder="Детайли" />
      </Form.Group>
      <Form.Group controlId="formBasicEmail">
        <Form.Label>Имейл</Form.Label>
        <Form.Control required type="email" name="email" placeholder="Имейл" />
      </Form.Group>
      <Form.Group controlId="formBasicConfirmPhone">
        <Form.Label>Телефон</Form.Label>
        <Form.Control required type="number" name="phone" placeholder="Телефон" />
      </Form.Group>
      <Form.Group controlId="formBasicConfirmAddress">
        <Form.Label>Адрес</Form.Label>
        <Form.Control required type="text" name="address" placeholder="Адрес" />
      </Form.Group>
      <Form.Group className="custom-multi-select" controlId="exampleForm.ControlSelect2">
        <Form.Label>Какви услуги ще предлагате</Form.Label>
        <Form.Control name="services" as="select" multiple>
          {services.map((service: any) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Form.Group controlId="formBasicConfirmAddress">
        <ImageUploader withIcon={true} onChange={onDrop} buttonText="Изберете снимки" imgExtension={['.jpg', '.gif', '.png', '.gif']} maxFileSize={5242880} />
      </Form.Group>
      <div className="d-flex">
        {pictures.map((file: any) => {
          const url: string = window.URL.createObjectURL(
            new Blob([file], {
              type: file.type,
            })
          )

          return (
            <div key={url} style={{ marginRight: '18px' }}>
              <img height="50px" width="50px" src={url} />
              <span style={{ cursor: 'pointer' }} onClick={removePictureByName(file.name)}>
                X
              </span>
            </div>
          )
        })}
      </div>
    </Form>
  )

  const renderStageTwo = () => (
    <Form
      onChange={(e: any) => {
        setPriceByServiceIds((prevState: any) => ({ ...prevState, [e.target.name]: e.target.value }))
      }}
      className="form"
    >
      {formState.services &&
        formState.services.map((currentService: any) => (
          <Form.Group key={currentService.id} controlId="formBasicName">
            <Form.Label>{currentService.name}</Form.Label>
            <Form.Control required type="number" name={currentService.id} placeholder="Въведете цена за 1 час работа" />
          </Form.Group>
        ))}
    </Form>
  )

  return (
    <Modal {...props} className="custom-modal" size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Създай компания за строителни услуги</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {stage === 0 && renderStageOne()}
        {stage === 1 && renderStageTwo()}
      </Modal.Body>
      <Modal.Footer>
        {stage === 0 && <Button onClick={() => setStage(1)}>Напред</Button>}
        {stage === 1 && <Button onClick={createCompany}>Създай Компания</Button>}
        <Button
          onClick={() => {
            props.onHide()
            setStage(0)
            setFormState({})
            setPictures([])
            setPriceByServiceIds({})
          }}
        >
          Затвори
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
