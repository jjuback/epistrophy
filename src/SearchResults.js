import React, {useState, useEffect} from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import Container from "react-bootstrap/Container";
import ListGroup from 'react-bootstrap/ListGroup';
import Alert from 'react-bootstrap/Alert';

export const SearchResults = (props) => {
  const [trackNo, setTrackNo] = useState(0);
  
  useEffect(() => {
    if (props.tracks.length === 0) return;
    const audio = document.getElementById("audioElement");
    audio.src = makeUrl(props.tracks[trackNo].url, props.genre);
    if (trackNo > 0) {
        audio.play();
    }
    navigator.mediaSession.metadata = new MediaMetadata({
        title: props.tracks[trackNo].title,
        artist: props.artist,
        album: props.tracks[trackNo].album,
        artwork: [
          { src: makeUrl(props.tracks[trackNo].cover, props.genre), sizes: '96x96' }
        ]
    });
  }, [props, trackNo]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  });  
  
  if (props.tracks.length === 0) return (
    <Alert variant="warning" className="mt-5">Search returned no results</Alert>
  );

  return (
    <Container className="mt-5">
      <audio id="audioElement" controls autoPlay={trackNo > 0}
       onEnded={() => {
          if (trackNo + 1 < props.tracks.length) {
              setTrackNo(trackNo + 1);
          } else {
              props.goBack();
          }
        }}
      />
      <ListGroup numbered>
        {props && props.tracks.map((data, key) => {
          return (
            <ListGroup.Item action as="li" className="d-flex justify-content-between align-items-start" active={key===trackNo} key={key} onClick={() => {setTrackNo(key); }}>
              <div className="ms-2 me-auto text-truncate">
                <div className="fw-bold text-truncate">{data.title}</div>
                <div className="opacity-50 text-truncate">{data.artist}</div>
              </div>
              <img alt={data.album} src={makeUrl(data.cover, props.genre)} width="30" height="30" className="d-inline-block align-self-center" />              
            </ListGroup.Item>
         );
        })}
      </ListGroup>
    </Container>
  );
};