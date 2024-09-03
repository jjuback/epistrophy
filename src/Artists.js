import React, {useEffect} from "react";
import parse from "html-react-parser";
import "./Artists.css";
import Accordion from 'react-bootstrap/Accordion';
import Container from 'react-bootstrap/Container';
import { ArtistDetail } from "./ArtistDetail";
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Spinner from 'react-bootstrap/Spinner';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
  },
})

export const Artists = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ArtistsByGenre {...props} />
    </QueryClientProvider>
  )
}

export const ArtistsByGenre = (props) => {

  useEffect(() => {
    window.scrollTo(0, props.scrollY);
  }, [props.scrollY]);

  const { isPending, error, data } = useQuery({
    queryKey: ['artists', props.genre],
    queryFn: async () => {
      const response = await fetch(
        `https://epistrophy-api.azurewebsites.net/genres/${props.genre}/artists`,
      )
      return await response.json()
    },
  })

  if (isPending) return <Spinner animation="border" />;

  if (error) return 'An error has occurred: ' + error.message;

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
            <NavDropdown title="Genre" drop="start" onSelect={(key, event) => { props.selectGenre(event.target.id === "genre-jazz" ? 0 : 1); }}>
              <NavDropdown.Item id="genre-jazz" active={props.genre === 0}>Jazz</NavDropdown.Item>
              <NavDropdown.Item id="genre-classical" active={props.genre === 1}>Classical</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        </Container>
      </Navbar>
      <Accordion className="mt-5" defaultActiveKey={props.current}>
        {data.map((artist) => {
          return (
            <Accordion.Item key={artist.name} eventKey={artist.name}>
              <Accordion.Header><span>{parse(artist.displayName, {trim: false})}</span></Accordion.Header>
              <Accordion.Body onEnter={() => props.setArtist(artist.name)}>
                {props.current === artist.name && <ArtistDetail {...props} {...artist} />}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </>
  );
};
