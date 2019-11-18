import React, {Fragment, useState, useEffect} from 'react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './config/firebaseConfig'

import MovieSearch from './components/MovieSearch'

import 'normalize.css'
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [movieListSource, setMovieListSource] = useState(null);

  useEffect(()=>{
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
      console.log(user);
    });
  });

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
        <div className="controls">
          { user ? 
            <button onClick={handleLogout}>Logout</button> :
            <button onClick={handleLogin}>Login</button>
          }
        </div>
        <MovieSearch setMovieListSource={setMovieListSource}/>
      </header>
      <main>
        {JSON.stringify(movieListSource)}
      </main>
    </Fragment>
  );
}

export default App;
