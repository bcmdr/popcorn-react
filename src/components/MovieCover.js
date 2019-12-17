import React, { useState, useCallback } from "react";
import { db } from "../db"

function MovieCover({ user, result, initialStatuses }) {
  const [statuses, setStatuses] = useState(initialStatuses);
  const [movieSaved, setMovieSaved] = useState(false);

  const saveMovie = useCallback(async () => {
    if (movieSaved) return;
    window.sessionStorage.setItem(`movie-${result.id}`, JSON.stringify(result));
    let movieInfoRef = db.collection("movies").doc(`${result.id}`);
    if (!movieInfoRef.exists) {
      await movieInfoRef.set(result);
    }
    setMovieSaved(true);
  }, [movieSaved, result]);

  const saveStatuses = useCallback(async (statuses) => {
    if (!user) return;
    const anyStatus = statuses.interested || statuses.favourite || statuses.seen;
    let userMovieRef = db.collection(`${user.uid}`).doc(`${result.id}`);
    if (anyStatus) { 
      let newUserMovie = {
        id: result.id,
        anyStatus: statuses.interested || statuses.favourite || statuses.seen,
        ...statuses
      } 
      await userMovieRef.set(newUserMovie);
    } else {
      await userMovieRef.delete()
    }
  }, [user, result]);

  const handleStatus = status => {
    let newStatuses = { ...statuses };
    newStatuses[status] = statuses ? !statuses[status] : true;
    setStatuses(newStatuses);
    saveStatuses(newStatuses);
    saveMovie();
  };

  return (
    <div className="cover">
      <h3 className="title">{result.title} <span className="release-year">({result.release_date.split('-')[0]})</span></h3>
      {result.poster_path ? (
        // https://developers.themoviedb.org/3/configuration/get-api-configuration
        <img
          src={`https://image.tmdb.org/t/p/w342/${result.poster_path}`}
          alt={result.title}
        />
      ) : null}
      {user ? (
        <div className="controls">
          <button
            data-val={statuses && statuses.interested}
            onClick={() => handleStatus("interested")}
          >
            Interested
          </button>
          <button
            data-val={statuses && statuses.seen}
            onClick={() => handleStatus("seen")}
          >
            Seen
          </button>
          <button
            data-val={statuses && statuses.favourite}
            onClick={() => handleStatus("favourite")}
          >
            Favourite
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default MovieCover;
