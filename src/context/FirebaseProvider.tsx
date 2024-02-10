import React, { useState, useEffect, FC, ReactNode } from 'react';
import { FirebaseContext } from './FirebaseContext';
import { firestore as db } from './../services/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { FirebaseUser } from './../models/FirebaseUser';

const FirebaseProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const auth = getAuth();
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is signed in.
        const userid = currentUser.uid;
        const userRef = doc(db, 'users', userid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const userData = snap.data();
          setUser({
            email: userData["email"],
            signInMethod: userData["signInMethod"],
            schedules: userData["schedules"],
            // Define other properties based on your FirebaseUser model
          } as FirebaseUser);
        } else {
          // Handle the case where the user document does not exist
          console.log('No such document!');
        }
      } else {
        // No user is signed in.
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <FirebaseContext.Provider value={{ user, setUser }}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
