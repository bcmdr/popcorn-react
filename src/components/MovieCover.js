import React, { useState, useEffect } from 'react';

function MovieCover({user, db, result, initialStatuses}) {

  const [statuses, setStatuses] = useState(initialStatuses || {});

  const handleInterested = () => {
    setStatuses({
      interested: !statuses.interested,
      ...statuses
    })
  }

  const handleSeen = () => {
    setStatuses({
      seen: !statuses.seen,
      ...statuses
    })
  }

  const handleFavourite = () => {
    setStatuses({
      favourite: !statuses.favourite,
      ...statuses
    })
  }

  useEffect(() => {
    async function updateStatuses() {
      if (!user) return;
      if (!statuses) return;
      let movieRef = db.collection(`${user.uid}`).doc(`${result.id}`);
      movieRef.set({
        ...statuses
      }, {merge: true});
    }
    updateStatuses();
  }, [statuses, user, result, db])


  return (
    <div className="cover">
      <h3 className="title">{result.title}</h3>
      {result.poster_path ? (
        // https://developers.themoviedb.org/3/configuration/get-api-configuration
        <img src={`https://image.tmdb.org/t/p/w342/${result.poster_path}`} alt={result.title} />
      ) : null}
      { user ? (
        <div className="controls">
          <button data-val={statuses.interested} onClick={handleInterested}>Interested</button>
          <button data-val={statuses.seen} onClick={handleSeen}>Seen</button>
          <button data-val={statuses.favourite} onClick={handleFavourite}>Favourite</button>
        </div>
        ) : null
      }
    </div>
  )
}

export default MovieCover;