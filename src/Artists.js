import React from "react";
import "./Artists.css";
import { cdVault } from "./data";
import { makeUrl } from "./utils";
import ListGroup from 'react-bootstrap/ListGroup';
import Accordion from 'react-bootstrap/Accordion';
import Image from 'react-bootstrap/Image';

export const Artists = (props) => {
  return (
    <>
      <Accordion>
        {cdVault.map((data, key) => {
            return (
                <Accordion.Item key={key} eventKey={key}>
                    <Accordion.Header>{data.Name}</Accordion.Header>
                    <Accordion.Body>
                        <ListGroup>
                          {data.Albums.map((data, key) => {
                            return (
                                <ListGroup.Item action key={key} onClick={() => props.selectAlbum(data)}>
                                    <Image className="cover-thumbnail" src={makeUrl(data.Cover)} />
                                    &nbsp;{data.Title}
                                </ListGroup.Item>
                            );
                          })}
                        </ListGroup>
                    </Accordion.Body>
                </Accordion.Item>
            );
        })}
      </Accordion>
    </>
  );
};