import React, { useState, useEffect, FC, ReactNode } from 'react';
import { FirebaseContext } from './FirebaseContext';
import { firestore as db } from './../services/firebase'; // import your firebase instance
import { updateDoc, arrayUnion, doc, onSnapshot, collection, getDocs, getDoc } from "firebase/firestore";
import { getAuth, signInAnonymously } from 'firebase/auth';
import { FirebaseUser} from './../models/FirebaseUser';


const FirebaseProvider: FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  // get rid of this
  for (let i = 0; i < 100; i++) {
    let z = i**3
  }

  const auth = getAuth();

  if (!auth.currentUser) {
    throw new Error("user must be signed in!");
  }

  const userid = auth.currentUser.uid

  useEffect(() => {
    let x = async () => {
      let userList = []
      const snap = await getDoc(doc(db, 'users', userid))
      if (snap.exists()) {
        const user = snap.data()
        setUser({
          email: user["email"],
          // schedules: {
          //     [name: string]: {
          //         likedCoursed: number[],
          //         selectedCourses: number[],
          //         selectedSections: number[]
          //     }
          // },
          // signInMethod: string,
          // darkTheme: boolean,
          // selectedSchedule: string
        } as FirebaseUser);
      }
    }
    x();

  }, []);


  return (
    <FirebaseContext.Provider value={{user, setUser}}>
      {children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseProvider;
