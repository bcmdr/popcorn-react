import React, { Fragment, useState, useEffect, useCallback } from "react";

import firebase from "./Firebase";
import "firebase/auth";
import "firebase/firestore";
import { db } from "./db";

import MovieSearch from "./components/MovieSearch";
import MovieCover from "./components/MovieCover";

import "normalize.css";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieListSource, setMovieListSource] = useState(null);
  const [userStatuses, setUserStatuses] = useState({});
  const [activeStatus, setActiveStatus] = useState("interested")

  const handleLogin = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    setMovieListSource(null);
  };

  const filterByStatus = useCallback(
    async (event, status) => {
      if (!user) return;
      event && event.preventDefault();
      let covers = document.querySelector('.covers')
      if (covers) {
        covers.classList.remove('revealed');
        covers.classList.add('hidden');
      }
      setActiveStatus(status);
      let results = [];
      const userRef = db.collection(`${user.uid}`).where(status, "==", true);
      if (!userRef) return;
      const snap = await userRef.get();
      if (!snap) return;
      if (snap.empty) setMovieListSource([]);
      let index = 0;
      snap.forEach(async result => {
        let sessionStorageResult = window.sessionStorage.getItem(`movie-${result.id}`);
        if (sessionStorageResult) {
          results.push(JSON.parse(sessionStorageResult));
        } else {
          const movieInfoRef = db.collection(`movies`).doc(`${result.id}`);
          const movieDoc = await movieInfoRef.get();
          if (movieDoc.exists) {
            const movieData = movieDoc.data();
            window.sessionStorage.setItem(`movie-${result.id}`, JSON.stringify(movieData));
            results.push(movieData); 
          }
        }
        if (index === snap.size - 1) {
          setMovieListSource(results);
          let covers = document.querySelector('.covers')
          if (covers) {
            covers.classList.remove('hidden')
            covers.classList.add('revealed');
          }
        }
        index += 1;
      });
    },
    [user]
  );

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(function(user) {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUserStatuses = async () => {
      if (!user) return;
      const userRef = user && db.collection(`${user.uid}`);
      if (userRef) {
        let userStatuses = {};
        const snap = await userRef.get();
        snap &&
          snap.forEach(result => {
            userStatuses[result.id] = result.data();
          });
        setUserStatuses(userStatuses);
      }
    };
    fetchUserStatuses();
  }, [user]);

  useEffect(() => {
    const showInterested = async () => {
      await filterByStatus(null, "interested");
    };
    showInterested();
  }, [filterByStatus]);

  return (
    <Fragment>
      <header>
        <nav data-active={activeStatus}>
          <ul>
            {!user && 
              <li className="home-link without-user">
                <span onClick={event => filterByStatus(event, "interested")}>PopCorn</span>
              </li>
            }
            {user && 
              <>
                <li className="home-link with-user">
                  <span onClick={event => filterByStatus(event, "interested")}>PopCorn</span>
                </li>
                <div>
                  <li className="interested-link">
                    <span onClick={event => filterByStatus(event, "interested")}>
                      Interested
                    </span>
                  </li>
                  <li className="seen-link">
                    <span onClick={event => filterByStatus(event, "seen")}>Seen</span>
                  </li>
                  <li className="favourite-link">
                    <span onClick={event => filterByStatus(event, "favourite")}>
                      Favourite
                    </span>
                  </li>
                </div>
              </>
            }
          </ul>
        </nav>
        <div className="nav-actions">
          {
            user && (
              <div className="searchContainer">
                <MovieSearch setMovieListSource={setMovieListSource} />
              </div>
            )
          }
          
          <div className="loginContainer">
              {user ? (
                <div className="dropdown">
                  <img className="profile-picture" src={user.photoURL} alt="profile"></img>
                  <div className="dropdown__content">
                    <button className="logout" onClick={handleLogout}>Logout</button>
                  </div>
                </div>
              ) : (
                <button className="login" onClick={handleLogin}>Login</button>
              )}
          </div>
        </div>
      </header>
      <main>
        {!user && !movieListSource && !loading &&
          <section className="welcome">
            <h1>Track Your Movies</h1>
            <p>Interested • Seen • Favourite</p>
            <button className="primary-button" onClick={handleLogin}>Login with Google</button>
          </section>
        }
        {movieListSource &&
          <section className="covers">
            {movieListSource.map(result => (
              <MovieCover
                key={result.id}
                user={user}
                result={result}
                initialStatuses={userStatuses[result.id]}
              />
            ))}
          </section>
        }
      </main>
      <footer>Powered by <span className="movieDb">The Movie DB</span></footer>
    </Fragment>
  );
}

export default App;
