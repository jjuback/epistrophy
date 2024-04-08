import React, {useState, useEffect} from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';

export const Album = (props) => {
  const [trackNo, setTrackNo] = useState(0);
  useEffect(() => {
    const audio = document.getElementById("audioElement");
    audio.src = makeUrl(props.Tracks[trackNo].Url);
    navigator.mediaSession.metadata = new MediaMetadata({
        title: props.Tracks[trackNo].Title,
        artist: props.Artist,
        album: props.Title,
        artwork: [
            { src: makeUrl(props.Cover), sizes: '96x96' }
        ]
    });
  }, [props, trackNo]);
  if (props === undefined) return null;
  return (
    <>
        <Tabs defaultActiveKey="tracks" onSelect={(k) => k==="back" ? props.goBack() : {}}>
            <Tab eventKey="back" title="<<" />
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
                <Image className="cover-large-thumbnail" src={makeUrl(props.Cover)} />
            </Tab>
        </Tabs>
    </>
  );
};