//import './App.css';
import React, {useState} from "react";
import { Artists } from './Artists';
import { Album } from './Album';
import Container from 'react-bootstrap/Container';

const App = () => {
    const [album, setAlbum] = useState();
    const [current, setCurrent] = useState();
    const [scrollY, setScrollY] = useState(0);
    const selectAlbum = (data) => { setAlbum(data); setScrollY(window.scrollY); }
    const goBack = () => setAlbum(undefined);

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
                <Album {...album} goBack={goBack} />
              </div>
            </Container>
          )
    }
};

export default App;
