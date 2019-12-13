import React, {Fragment, useState, useEffect, useCallback} from 'react';

import firebase from './Firebase';
import 'firebase/auth';
import 'firebase/firestore';
import { db } from './db'

import MovieSearch from './components/MovieSearch'
import MovieCover from './components/MovieCover'

import 'normalize.css'
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [movieListSource, setMovieListSource] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [statusFilter, setStatusFilter] = null;

  const handleLogin = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  const handleLogout = () => {
    firebase.auth().signOut();
  }

  const filterByStatus = useCallback(async (event, status) => {
    console.log('fetching')
    event && event.preventDefault();
    let results = [];
    let index = 0;
    const userRef = user && db.collection(`${user.uid}`).where(status, "==", true);
    if (!userRef) return;
    const snap = await userRef.get();
    if (!snap) return;
    if (snap.empty) setMovieListSource(results);
    snap.forEach(async (result) => {
      if (result.data()[status]) {
        const movieInfoRef = db.collection(`movies`).doc(`${result.id}`);
        const movieDoc = await movieInfoRef.get();
        movieDoc.exists && results.push(movieDoc.data());
      }
      if (index === snap.size - 1) {
        setMovieListSource(results);
      }
      index += 1;
    });
  }, [user]);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(()=> {
    const fetchUserStatuses = async () => {
      if (!user) return;
      const userRef = user && db.collection(`${user.uid}`);
      if (userRef) {
        let userStatuses = {};
        const snap = await userRef.get();
        snap && snap.forEach(result => {
          userStatuses[result.id] = result.data();
        });
        console.log(userStatuses)
        setUserStatuses(userStatuses);
      }
    }
    fetchUserStatuses();
  }, [user]);

  useEffect(() => {
    const showAll = async () => {
      await filterByStatus(null, 'anyStatus');
    }
    showAll();
  }, [filterByStatus])

  return (
    <Fragment>
      <header>
        <nav>
          <li><a href="/">PopCorn</a></li>
          <li><span onClick={(event) => filterByStatus(event, 'interested')}>Interested</span></li>
          <li><span onClick={(event) => filterByStatus(event, 'seen')}>Seen</span></li>
          <li><span onClick={(event) => filterByStatus(event, 'favourite')}>Favourite</span></li>
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
        {movieListSource && movieListSource.map((result) => (
          <MovieCover 
            key={result.id}
            user={user}
            result={result}
            initialStatuses={userStatuses[result.id]}
          />
        ))}
      </main>
    </Fragment>
  );
}

export default App;
