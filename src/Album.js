import React, {useState} from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const Album = (props) => {
  const [trackNo, setTrackNo] = useState(0);
  if (props === undefined) return null;
  return (
    <>
      <Container>
        <Row>
            <Col sm={4}>
            <Card>
            <Card.Header as="h5">{props.Title}</Card.Header>
        <Card.Img className="cover-large-thumbnail" src={makeUrl(props.Cover)} thumbnail="true" />
        <Card.Footer>
            <Button variant="secondary" onClick={() => props.goBack()}>Back</Button>
        </Card.Footer>
        </Card>
            </Col>
            <Col sm={8}>
            <ListGroup numbered>
            {props && props.Tracks.map((data, key) => {
                return (
                    <ListGroup.Item action active={key===trackNo} key={key} onClick={() => setTrackNo(key)}>
                        {data.Title}
                    </ListGroup.Item>
                );
            })}
            </ListGroup>
            <br />
            <audio controls src={makeUrl(props.Tracks[trackNo].Url)} autoPlay={trackNo > 0} onEnded={() => {
                if (trackNo + 1 < props.Tracks.length) {
                    setTrackNo(trackNo + 1);
                } else {
                    props.goBack();
                }
            }}/>
            </Col>
        </Row>
      </Container>
    </>
  );
};