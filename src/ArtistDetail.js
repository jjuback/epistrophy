import React from "react";
import "./Artists.css";
import { makeUrl, config } from "./utils";
import Figure from 'react-bootstrap/Figure';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { useQuery } from '@tanstack/react-query'

export const ArtistDetail = (props) => {

  const { isPending, error, data } = useQuery({
    queryKey: ['artistdetail', props.genre, props.index],
    queryFn: async () => {
      const response = await fetch(
        `${config.EPISTROPHY_API_URL}/genres/${props.genre}/artists/${props.index}`
      )
      return await response.json()
    },
  })

  if (isPending) return (
    <>
      <div className="d-flex justify-content-center">
        <Spinner animation="border" />
      </div>
    </>
  );

  if (error) return (
    <Alert variant="danger">
      <Alert.Heading>An error has occurred</Alert.Heading>
      <p>{error.message}</p>
    </Alert>
  );

  return (
    <>
      <Container>
        <Row className="flex-wrap">
          {data.albums.map((album, index) => {
            return (
              <Col key={index.toString()} className="col-auto figure text-center">
                <Figure className="align-items-center" onClick={() => { props.selectAlbum(album, props.name) }}>
                  <Figure.Image className="cover-thumbnail" src={makeUrl(album.cover, props.genre)} />
                  <Figure.Caption className="cover-caption">
                    {album.title}
                  </Figure.Caption>
                </Figure>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};
