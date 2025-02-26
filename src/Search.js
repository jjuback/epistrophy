import React from "react";
import "./Artists.css";
import { config } from './utils';
import { SearchResults } from "./SearchResults";
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'

const queryClient = new QueryClient();

queryClient.setDefaultOptions({
  queries: {
    staleTime: Infinity,
  },
})

export const Search = (props) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchByGenre {...props} />
    </QueryClientProvider>
  )
}

export const SearchByGenre = (props) => {

  const { isPending, error, data } = useQuery({
    queryKey: ['search', props.searchText],
    queryFn: async () => {
      const response = await fetch(
        `${config.EPISTROPHY_API_URL}/genres/${props.genre}/search/${props.searchText}`,
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
    <SearchResults genre={props.genre} tracks={data} scrollY={props.scrollY} />
  );
};