import React, {useState, useEffect, useRef} from "react";
import { Artists } from './Artists';
import { Album } from './Album';
import { Search } from './Search';
import { config } from "./utils";
import Container from 'react-bootstrap/Container';
import Nav from "react-bootstrap/Nav";
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from "react-bootstrap/InputGroup";
import Modal from 'react-bootstrap/Modal';

const App = () => {
    const [album, setAlbum] = useState();
    const [artist, setArtist] = useState();
    const [genre, setGenre] = useState(0);
    const [count, setCount] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const [searchText, setSearchText] = useState(null);
    const [show, setShow] = useState(false);

    const modalClose = () => { setShow(false); }
    const modalShow = () => setShow(true);
    const startSearch = (n) => { setSearchText(n); modalClose(); }
    const endSearch = () => { setSearchText(null); }
    const searchRef = useRef(null);
    const doSearch = () => { startSearch(searchRef.current.value); setScrollY(window.scrollY); setCount(count + 1); }

    const selectAlbum = (data, name) => { setAlbum(data); setArtist(name); setScrollY(window.scrollY); setCount(count + 1); }
    const selectGenre = (n) => { setArtist(undefined); setGenre(n); setScrollY(0); }
    const goBack = () => setAlbum(undefined);

    useEffect(() => {
      document.title = album ? album.title : "Epistrophy";
    }, [album]);

    switch (album) {
        case undefined:
          return (
            <Container className="p-3">
              <div className="App">
                <Navbar className="fixed-top bg-body-tertiary">
                  <Container>
                    <Navbar.Brand>
                      <img
                        alt="Epistrophy Logo"
                        src="/apple-touch-icon.png"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                      />&nbsp;&nbsp;
                      Epistrophy
                    </Navbar.Brand>
                    <Navbar.Collapse className="justify-content-end">
                      <Nav className="me-2 pe-4">
                        {!searchText && <NavDropdown title="Genre" drop="down" onSelect={(key, event) => { selectGenre(event.target.id === "genre-jazz" ? 0 : 1); }}>
                          <NavDropdown.Item id="genre-jazz" active={genre === 0}>Jazz</NavDropdown.Item>
                          <NavDropdown.Item id="genre-classical" active={genre === 1}>Classical</NavDropdown.Item>
                        </NavDropdown>}
                      </Nav>
                      {!searchText && <Button variant="outline-light" id="button-search" onClick={modalShow}>{config.ICON_SEARCH}</Button>}
                      {searchText && <Button variant="outline-light" id="button-back" onClick={endSearch}>{config.ICON_CANCEL}</Button>}
                    </Navbar.Collapse>
                  </Container>
                </Navbar>
                <Modal className="mt-5" show={show} onHide={modalClose}>
                  <Modal.Body>
                    <InputGroup>
                      <Form.Control type="text" ref={searchRef} placeholder="Search Tracks" autoFocus className="mr-sm-2"
                       onKeyUp={event => { if (event.key === "Enter") { doSearch(); }}} />
                      <Button variant="outline-light" id="button-search" onClick={doSearch}>{config.ICON_SEARCH}</Button>
                      <Button variant="outline-light" id="button-cancel" onClick={modalClose}>{config.ICON_CANCEL}</Button>
                    </InputGroup>
                  </Modal.Body>
                </Modal>
                {searchText && <Search genre={genre} searchText={searchText} scrollY={scrollY} />}
                {!searchText && <Artists current={artist} setArtist={setArtist} genre={genre} selectGenre={selectGenre} selectAlbum={selectAlbum} scrollY={scrollY} />}
              </div>
            </Container>
          )
        default:
          return (
            <Container className="p-3">
              <div className="App">
                <Album {...album} artist={artist} genre={genre} goBack={goBack} count={count} />
              </div>
            </Container>
          )
    }
};

export default App;
