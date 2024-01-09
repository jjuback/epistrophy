//import './App.css';
import React, {useState, useEffect} from "react";
import { Artists } from './Artists';
import { Album } from './Album';
import Container from 'react-bootstrap/Container';

const App = () => {
    const [album, setAlbum] = useState();
    const [artist, setArtist] = useState('');
    const [current, setCurrent] = useState();
    const [scrollY, setScrollY] = useState(0);
    const selectAlbum = (data, name) => { setAlbum(data); setArtist(name); setScrollY(window.scrollY); }
    const goBack = () => setAlbum(undefined);

    useEffect(() => {
      document.title = album ? album.Title : "Epistrophy";
    }, [album]);

    switch (album) {
        case undefined:
          return (
            <Container className="p-3">
              <div className="App">
                <Artists current={current} scrollY={scrollY} setCurrent={setCurrent} selectAlbum={selectAlbum} />
              </div>
            </Container>
          )
        default:
          return (
            <Container className="p-3">
              <div className="App">
                <Album {...album} Artist={artist} goBack={goBack} />
              </div>
            </Container>
          )
    }
};

export default App;
