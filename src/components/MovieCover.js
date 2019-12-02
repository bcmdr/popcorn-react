import React, { useState, useEffect, useCallback } from 'react';

function MovieCover({user, db, result, initialStatuses}) {

  const [statuses, setStatuses] = useState(initialStatuses);
  const [interacted, setInteracted] = useState(false);
  const [movieSaved, setMovieSaved] = useState(false);

  const handleStatus = (status) => {
    let newStatuses = {...statuses};
    newStatuses[status] = statuses ? !statuses[status] : true;
    setStatuses(newStatuses);
    setInteracted(true);
  };
  
  const saveMovie = useCallback(() => {
    if (movieSaved) return;
    let movieInfoRef = db.collection('movies').doc(`${result.id}`);
    if (!movieInfoRef.exists) movieInfoRef.set(result);
    setMovieSaved(true);
  }, [db, movieSaved, result]);

  const updateStatuses = useCallback(async () => {
    if (!user) return;
    if (!interacted) return; 

    let userMovieRef = db.collection(`${user.uid}`).doc(`${result.id}`);
    userMovieRef.set({
      ...statuses
    }, {merge: true});

    setInteracted(false);  
  }, [user, interacted, db, result, statuses]);

  useEffect(() => {

    if (interacted) {
      saveMovie();
      updateStatuses();
    }

  }, [statuses, user, result, db, interacted, saveMovie, updateStatuses]);


  return (
    <div className="cover">
      <h3 className="title">{result.title}</h3>
      {result.poster_path ? (
        // https://developers.themoviedb.org/3/configuration/get-api-configuration
        <img src={`https://image.tmdb.org/t/p/w342/${result.poster_path}`} alt={result.title} />
      ) : null}
      { user ? (
        <div className="controls">
          <button data-val={statuses && statuses.interested} onClick={() => handleStatus('interested')}>Interested</button>
          <button data-val={statuses && statuses.seen} onClick={() => handleStatus('seen')}>Seen</button>
          <button data-val={statuses && statuses.favourite} onClick={() => handleStatus('favourite')}>Favourite</button>
        </div>
        ) : null
      }
    </div>
  )
}

export default MovieCover;