//import './App.css';
import React, {useState, useEffect} from "react";
import { Artists } from './Artists';
import { Album } from './Album';
import Container from 'react-bootstrap/Container';

const App = () => {
    const [album, setAlbum] = useState();
    const [artist, setArtist] = useState();
    const [genre, setGenre] = useState(0);
    const [count, setCount] = useState(0);
    const [scrollY, setScrollY] = useState(0);
    const selectAlbum = (data, name) => { setAlbum(data); setArtist(name); setScrollY(window.scrollY); setCount(count + 1); }
    const selectGenre = (n) => { setArtist(undefined); setGenre(n); setScrollY(0); }
    const goBack = () => setAlbum(undefined);

    useEffect(() => {
      document.title = album ? album.Title : "Epistrophy";
    }, [album]);

    switch (album) {
        case undefined:
          return (
            <Container className="p-3">
              <div className="App">
                <Artists current={artist} genre={genre} selectGenre={selectGenre} selectAlbum={selectAlbum} scrollY={scrollY} />
              </div>
            </Container>
          )
        default:
          return (
            <Container className="p-3">
              <div className="App">
                <Album {...album} Artist={artist} genre={genre} goBack={goBack} count={count} />
              </div>
            </Container>
          )
    }
};

export default App;
