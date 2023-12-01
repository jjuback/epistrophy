import React, {useEffect} from "react";
import "./Artists.css";
import { cdVault } from "./data";
import { makeUrl } from "./utils";
import Accordion from 'react-bootstrap/Accordion';
import Figure from 'react-bootstrap/Figure';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Artists = (props) => {

  useEffect(() => {
    window.scrollTo(0, props.scrollY);
  }, [props.scrollY]);
  
  return (
    <>
      <Accordion defaultActiveKey={props.current}>
        {cdVault.map((data, key) => {
            return (
                <Accordion.Item key={key} eventKey={key}>
                    <Accordion.Header>{data.Name}</Accordion.Header>
                    <Accordion.Body>
                        <Container>
                          <Row className="flex-wrap">
                          {data.Albums.map((data, index) => {
                            return (
                              <Col key={index} className="col-auto figure text-center">
                                  <Figure className="align-items-center" onClick={() => { props.setCurrent(key); props.selectAlbum(data) }}>
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
