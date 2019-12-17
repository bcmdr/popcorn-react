import React, { useState } from 'react';

const MovieSearch = ({setMovieListSource}) => {
  const [searchValue, setSearchValue] = useState('');

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!searchValue) return;

    try {
    // const configResponse = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${tmdb.key}`)
    // const config = await configResponse.json();
    const resultsResponse = await fetch(`.netlify/functions/tmdbSearch?query=${searchValue}`);
    const results = await resultsResponse.json();

    setMovieListSource(results.results)

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="search">
      <label htmlFor="searchInput" hidden>Search</label>
      <input id="searchInput" type="text" value={searchValue} onChange={handleInputChange}></input>
      <input className="primary-button" type="submit" value="Search"></input>
    </form>
  )
}

export default MovieSearch;