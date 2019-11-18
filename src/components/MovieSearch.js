import React, { useState } from 'react';

const MovieSearch = ({setMovieListSource}) => {
  const [searchValue, setSearchValue] = useState('');
  const movieDbApiRootUrl = 'https://api.themoviedb.org/3'
  const movieDbApiKey = process.env.movieDbApiKey; // Here we hide value in environment

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
    // const configResponse = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${tmdb.key}`)
    // const config = await configResponse.json();
    
    const resultsResponse = await fetch(`.netlify/functions/tmdbSearch.js&query=${searchValue}`);
    const results = await resultsResponse.json();

    console.log(results)

    setMovieListSource(results)
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="searchInput" hidden>Search</label>
      <input id="searchInput" type="text" value={searchValue} onChange={handleInputChange}></input>
      <input type="submit" value="search"></input>
    </form>
  )
}

export default MovieSearch