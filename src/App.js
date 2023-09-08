//import './App.css';
import React, {useState} from "react";
import { Artists } from './Artists';
import { Album } from './Album';
import Container from 'react-bootstrap/Container';

const App = () => {
    const [album, setAlbum] = useState();
    const selectAlbum = (data) => setAlbum(data);
    const goBack = () => setAlbum(undefined);

    switch (album) {
        case undefined:
          return (
            <Container className="p-3">
              <div className="App">
                <Artists selectAlbum={selectAlbum} />
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
