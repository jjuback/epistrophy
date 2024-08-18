import React, {useState, useEffect} from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Stack from 'react-bootstrap/Stack';
import { Nav } from "react-bootstrap";

export const Album = (props) => {
  const [trackNo, setTrackNo] = useState(0);
  useEffect(() => {
    const audio = document.getElementById("audioElement");
    audio.src = makeUrl(props.Tracks[trackNo].Url, props.genre);
    if (trackNo > 0) {
        audio.play();
    }
    navigator.mediaSession.metadata = new MediaMetadata({
        title: props.Tracks[trackNo].Title,
        artist: props.Artist,
        album: props.Title,
        artwork: [
            { src: makeUrl(props.Cover, props.genre), sizes: '96x96' }
        ]
    });
  }, [props, trackNo]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [props.count]);  
  if (props === undefined) return null;
  return (
    <>
      <Navbar className="fixed-top bg-body-tertiary">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src={makeUrl(props.Cover, props.genre)}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Collapse className="album-title">
            <Stack className="small text-truncate" gap={0}>
                <div className="fw-bold text-truncate">{props.Title}</div>
                <div className="opacity-50 text-truncate">{props.Artist}</div>
            </Stack>
          </Navbar.Collapse>
          <Navbar.Collapse className="justify-content-end">
            <Nav defaultActiveKey="back" onSelect={() => props.goBack()}>
              <Nav.Item>
                <Nav.Link className="fw-bold" eventKey="back">&#x23f4;</Nav.Link>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
        <Tabs className="mt-5" defaultActiveKey="tracks" onSelect={(k) => k==="back" ? props.goBack() : {}}>
            <Tab eventKey="tracks" title="Tracks">
                <audio id="audioElement" controls autoPlay={trackNo > 0}
                 onEnded={() => {
                    if (trackNo + 1 < props.Tracks.length) {
                        setTrackNo(trackNo + 1);
                    } else {
                        props.goBack();
                    }
                 }}
                />
                <ListGroup numbered>
                    {props && props.Tracks.map((data, key) => {
                        return (
                            <ListGroup.Item action active={key===trackNo} key={key} onClick={() => setTrackNo(key)}>
                                {data.Title}
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </Tab>
            <Tab eventKey="cover" title="Cover">
                <Image className="cover-large-thumbnail" src={makeUrl(props.Cover, props.genre)} />
            </Tab>
        </Tabs>
    </>
  );
};