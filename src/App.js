import React, {Fragment, useState, useEffect} from 'react';

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

  useEffect(()=>{
    async function fetchUserStatuses() {
      const userRef = user && db.collection(`${user.uid}`);
      if (userRef) {
        let userStatuses = {};
        const snap = await userRef.get();
        snap && snap.forEach(result => userStatuses[result.id] = result.data());
        setUserStatuses(userStatuses)
      }
    }

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
    });

    setDb(firebase.firestore());

    fetchUserStatuses();

  }, [setDb, db, user]);

  const handleLogin = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  const handleLogout = () => {
    firebase.auth().signOut();
  }


  return (
    <Fragment>
      <header>
        <div className="branding">
          <a href="/">PopCorn</a>
        </div>
        <nav>
          <li><a href="/">Interested</a></li>
          <li><a href="/">Seen</a></li>
          <li><a href="/">Favourite</a></li>
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
            key={index}
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
