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
import Navbar from 'react-bootstrap/Navbar';

export const Artists = (props) => {

  useEffect(() => {
    window.scrollTo(0, props.scrollY);
  }, [props.scrollY]);
  
  return (
    <>
      <Navbar className="fixed-top bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src="/apple-touch-icon.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            Epistrophy
          </Navbar.Brand>
        </Container>
      </Navbar>
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
