import React, { useState, useEffect } from 'react';

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}

function MovieCover({user, db, result, initialStatuses}) {

  const [statuses, setStatuses] = useState(initialStatuses || {
    interested: false,
    seen: false,
    favourite: false
  });

  const handleInterested = () => {
    setStatuses({
      ...statuses,
      interested: !statuses.interested
    })
    console.log(statuses)
  }

  const handleSeen = () => {
    setStatuses({
      ...statuses,
      seen: !statuses.seen,
    })
  }

  const handleFavourite = () => {
    setStatuses({
      ...statuses,
      favourite: !statuses.favourite,
    })
  }

  useEffect(() => {
    async function updateStatuses() {
      console.log('updating statuses...')
      if (!user) return;
      if (isEmpty(statuses)) return;
      let movieRef = db.collection(`${user.uid}`).doc(`${result.id}`);
      movieRef.set({
        ...statuses
      }, {merge: true});
      setStatuses(statuses);
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