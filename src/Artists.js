import React, {useEffect} from "react";
import parse from "html-react-parser";
import "./Artists.css";
import { cdVault } from "./data";
import { makeUrl } from "./utils";
import Accordion from 'react-bootstrap/Accordion';
import Figure from 'react-bootstrap/Figure';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';

export const Artists = (props) => {

  useEffect(() => {
    window.scrollTo(0, props.scrollY);
  }, [props.scrollY]);
  
  return (
    <>
      <Stack direction="horizontal" gap={1} className="fixed-top bg-dark py-3 justify-content-center">
        <Button variant="primary" className="btn-sm">A</Button>
        <Button variant="primary" className="btn-sm">B</Button>
        <Button variant="primary" className="btn-sm">C</Button>
        <Button variant="primary" className="btn-sm">D</Button>
        <Button variant="primary" className="btn-sm">E</Button>
        <Button variant="primary" className="btn-sm">F</Button>
        <Button variant="primary" className="btn-sm">G</Button>
        <Button variant="primary" className="btn-sm" onClick={() => window.scrollTo(0, 400)}>H</Button>
        <Button variant="primary" className="btn-sm">I</Button>
        <Button variant="primary" className="btn-sm">J</Button>
        <Button variant="primary" className="btn-sm">K</Button>
        <Button variant="primary" className="btn-sm">L</Button>
        <Button variant="primary" className="btn-sm">M</Button>
        <Button variant="primary" className="btn-sm">N</Button>
        <Button variant="primary" className="btn-sm">O</Button>
        <Button variant="primary" className="btn-sm">P</Button>
        <Button variant="primary" className="btn-sm">Q</Button>
        <Button variant="primary" className="btn-sm">R</Button>
        <Button variant="primary" className="btn-sm">S</Button>
        <Button variant="primary" className="btn-sm">T</Button>
        <Button variant="primary" className="btn-sm">U</Button>
        <Button variant="primary" className="btn-sm">V</Button>
        <Button variant="primary" className="btn-sm">W</Button>
        <Button variant="primary" className="btn-sm">X</Button>
        <Button variant="primary" className="btn-sm">Y</Button>
        <Button variant="primary" className="btn-sm">Z</Button>
      </Stack>
      <Accordion className="mt-5" defaultActiveKey={props.current}>
        {cdVault.map((artist, key) => {
            return (
                <Accordion.Item key={key} eventKey={key}>
                    <Accordion.Header><span>{parse(artist.DisplayName, {trim: false})}</span></Accordion.Header>
                    <Accordion.Body>
                        <Container>
                          <Row className="flex-wrap">
                          {artist.Albums.map((data, index) => {
                            return (
                              <Col key={index} className="col-auto figure text-center">
                                  <Figure className="align-items-center" onClick={() => { props.setCurrent(key); props.selectAlbum(data, artist.Name) }}>
                                    <Figure.Image className="cover-thumbnail" src={makeUrl(data.Cover)} />
                                    <Figure.Caption className="cover-caption">
                                      {data.Title}
                                    </Figure.Caption>
                                  </Figure>
                              </Col>
                            );
                          })}
                        </Row>
                        </Container>
                    </Accordion.Body>
                </Accordion.Item>
            );
        })}
      </Accordion>
    </>
  );
};
