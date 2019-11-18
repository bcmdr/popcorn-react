import React from 'react'

const LoginLogout = ({}) => {

  const handleLogin = () => {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  const handleLogout = () => {
    firebase.auth().signOut();
  }

  return (
    <div>
    { user ? 
      <button onClick={handleLogout}>Logout</button> :
      <button onClick={handleLogin}>Login</button>
    }
    </div>
  ) 
}

export default LoginLogout();
