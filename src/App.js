import React, {Fragment, useState, useEffect, useCallback} from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig'

import MovieSearch from './components/MovieSearch'
import MovieCover from './components/MovieCover'

import 'normalize.css'
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [movieListSource, setMovieListSource] = useState(null);
  const [db, setDb] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [statusFilter, setStatusFilter] = null;

  const fetchUserStatuses = useCallback(async () => {
    const userRef = user && db.collection(`${user.uid}`);
    if (userRef) {
      let userStatuses = {};
      const snap = await userRef.get();
      snap && snap.forEach(result => {
        userStatuses[result.id] = result.data();
      });
      setUserStatuses(userStatuses);
    }
  }, [db, user])

  useEffect(() => {

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
    });

    setDb(firebase.firestore());

    fetchUserStatuses();

  }, [setDb, db, user, movieListSource, fetchUserStatuses]);

  const handleLogin = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  const handleLogout = () => {
    firebase.auth().signOut();
  }

  const show = async (event, status) => {
    event.preventDefault();

    if (statusFilter === status) return;
    setStatusFilter(status)

    let results = []
    const userRef = user && db.collection(`${user.uid}`);
    if (!userRef) return 
    const snap = await userRef.get();
    snap && snap.forEach(async result => {
      if (result.data()[status]) {
        const movieInfoRef = db.collection(`movies`).doc(`${result.id}`);
        const movieDoc = await movieInfoRef.get();
        movieDoc.exists && results.push(movieDoc.data());
        setMovieListSource(results);
      }});
  }


  return (
    <Fragment>
      <header>
        <nav>
          <li><a href="/">PopCorn</a></li>
          <li><span onClick={(event) => show(event, 'interested')}>Interested</span></li>
          <li><span onClick={(event) => show(event, 'seen')}>Seen</span></li>
          <li><span onClick={(event) => show(event, 'favourite')}>Favourite</span></li>
        </nav>
        <MovieSearch setMovieListSource={setMovieListSource}/>
        <div className="login">
          { user ? 
            <button onClick={handleLogout}>Logout</button> :
            <button onClick={handleLogin}>Login</button>
          }
        </div>
      </header>
      <main className="covers">
        {movieListSource && movieListSource.map((result, index) => (
          <MovieCover 
            key={result.id}
            user={user}
            result={result}
            db={db}
            initialStatuses={userStatuses[result.id]}
          />
        ))}
      </main>
    </Fragment>
  );
}

export default App;
