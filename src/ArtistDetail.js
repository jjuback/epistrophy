import React from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import Figure from 'react-bootstrap/Figure';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';
import { useQuery } from '@tanstack/react-query'

export const ArtistDetail = (props) => {

  const { isPending, error, data } = useQuery({
    queryKey: ['artistdetail', props.genre, props.index],
    queryFn: async () => {
      const response = await fetch(
        `https://epistrophy-api.azurewebsites.net/genres/${props.genre}/artists/${props.index}`
      )
      return await response.json()
    },
  })

  if (isPending) return <Spinner animation="border" />;

  if (error) return 'An error has occurred: ' + error.message;

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
