import * as firebase from "firebase/app";
import "firebase/auth";
import { useContext } from "react";
import { userContext } from "./user-context";

const provider = new firebase.auth.GoogleAuthProvider();

export const useSession = () => {
  const { user } = useContext(userContext);
  return user;
};

export const loginWithGoogle = async () => {
  try {
    const result = await firebase.auth().signInWithPopup(provider);
  } catch (err) {
    console.error(err);
    throw err;
  }
};
