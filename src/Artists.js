import React, {useEffect} from "react";
import parse from "html-react-parser";
import "./Artists.css";
import { cdVault, cdVaultClassical } from "./data";
import { makeUrl } from "./utils";
import Accordion from 'react-bootstrap/Accordion';
import Figure from 'react-bootstrap/Figure';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
            />&nbsp;&nbsp;
            Epistrophy
          </Navbar.Brand>
          <Navbar.Collapse className="justify-content-end">
          <Nav className="me-2">
            <NavDropdown title="Genre" onSelect={(key, event) => { props.selectGenre(event.target.id === "genre-jazz" ? 0 : 1); }}>
              <NavDropdown.Item id="genre-jazz" active={props.genre === 0}>Jazz</NavDropdown.Item>
              <NavDropdown.Item id="genre-classical" active={props.genre === 1}>Classical</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <Accordion className="mt-5" defaultActiveKey={props.current}>
        {(props.genre === 0 ? cdVault : cdVaultClassical).map((artist) => {
            return (
                <Accordion.Item key={artist.Name} eventKey={artist.Name}>
                    <Accordion.Header><span>{parse(artist.DisplayName, {trim: false})}</span></Accordion.Header>
                    <Accordion.Body>
                        <Container>
                          <Row className="flex-wrap">
                          {artist.Albums.map((data, index) => {
                            return (
                              <Col key={index.toString()} className="col-auto figure text-center">
                                  <Figure className="align-items-center" onClick={() => { props.selectAlbum(data, artist.Name) }}>
                                    <Figure.Image className="cover-thumbnail" src={makeUrl(data.Cover, props.genre)} />
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
