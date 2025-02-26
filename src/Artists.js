import React, {useEffect} from "react";
import parse from "html-react-parser";
import "./Artists.css";
import { config } from './utils';
import Accordion from 'react-bootstrap/Accordion';
import { ArtistDetail } from "./ArtistDetail";
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
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
        `${config.EPISTROPHY_API_URL}/genres/${props.genre}/artists`,
      )
      return await response.json()
    },
  })

  if (isPending) return (
    <>
      <div className="spinner-center">
        <Spinner animation="border" />
      </div>
    </>
  );

  if (error) return (
    <Alert variant="danger" className="mt-5">
      <Alert.Heading>An error has occurred</Alert.Heading>
      <p>{error.message}</p>
    </Alert>
  );

  return (
    <>
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
