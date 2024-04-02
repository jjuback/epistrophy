import React, {useState} from "react";
import "./Artists.css";
import { makeUrl } from "./utils";
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import MediaSession from '@mebtte/react-media-session';

export const Album = (props) => {
  const [trackNo, setTrackNo] = useState(0);
  if (props === undefined) return null;
  return (
    <>
        <Tabs defaultActiveKey="tracks" onSelect={(k) => k==="back" ? props.goBack() : {}}>
            <Tab eventKey="back" title="<<" />
            <Tab eventKey="tracks" title="Tracks">
                <MediaSession
                 title={props.Tracks[trackNo].Title}
                 album={props.Title}
                 artist={props.Artist}
                 artwork={[
                   { src: makeUrl(props.Cover), sizes: '96x96' }
                 ]}
                 onEnded={() => {
                    if (trackNo + 1 < props.Tracks.length) {
                        setTrackNo(trackNo + 1);
                    }
                 }}
                >
                    <audio controls src={makeUrl(props.Tracks[trackNo].Url)} autoPlay={trackNo > 0} onEnded={() => {
                        if (trackNo + 1 < props.Tracks.length) {
                            setTrackNo(trackNo + 1);
                        } else {
                            props.goBack();
                        }
                    }}/>
                </MediaSession>
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