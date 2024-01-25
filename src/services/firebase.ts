import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getDatabase } from "firebase/database";
import {
  getFirestore,
  Firestore,
  doc,
  DocumentData,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  runTransaction,
} from "firebase/firestore";
import { Schedule } from "../components/CourseDisplay/CourseUI/CourseTypes";

// Your web app's Firebase configuration
// Supply these environment variables when developing locally.
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export const db = getDatabase(app);
export const firestore: Firestore = getFirestore(app);

export const auth = getAuth(app);

export const createUserDocument = async (
  user: any,
  signInMethod: string,
  additionalData?: object
) => {
  // You might want to replace 'any' with a more specific type if possible.
  const userRef = doc(firestore, "users", user.uid);
  const snapshot = await getDoc(userRef);
  if (!snapshot.exists()) {
    const { email } = user;
    const createdAt = new Date();
    const defaultSchedule = {
      name: "Primary",
      selectedCourses: [],
      likedCourses: [],
      selectedSections: [],
      };
    try {
      await setDoc(userRef, {
        email,
        createdAt,
        signInMethod,
        schedules: [defaultSchedule],
        ...additionalData,
      });
    } catch (error) {
      console.error("Error creating user document", error);
    }
  }
  return getUserDocument(user.uid);
};

export const getUserDocument = async (uid: string) => {
  if (!uid) return null;
  try {
    const userDocument = await getDoc(doc(firestore, "users", uid));
    return userDocument.exists() ? userDocument.data() : null;
  } catch (error) {
    console.error("Error fetching user document", error);
  }
};

export const addNewSchedule = async (uid: string, scheduleName: string) => {
  const userRef = doc(firestore, "users", uid);

  // Fetch the current schedules
  const userDoc = await getDoc(userRef);
  let currentSchedules = userDoc.data()?.schedules;

  // Ensure currentSchedules is an array
  if (!Array.isArray(currentSchedules)) {
    console.warn(
      "Expected 'schedules' to be an array, but it's not. Resetting to an empty array."
    );
    currentSchedules = [];
  }

  // Create a new schedule object
  const newSchedule = {
    name: scheduleName,
    selectedCourses: [],
    likedCourses: [],
    selectedSections: [],
  };

  // Append the new schedule to the current schedules
  const updatedSchedules = [...currentSchedules, newSchedule];
  console.log(updatedSchedules);

  // Update Firestore with the appended schedules
  await updateDoc(userRef, { schedules: updatedSchedules });
};

export const getAllSchedules = async (uid: string) => {
  // Reference to the user's document
  const userRef = doc(firestore, "users", uid);

  // Retrieve the user's document and extract the schedules
  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      return userDoc.data().schedules;
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
};

export const renameSchedule = async (
  uid: string,
  oldName: string,
  renamedSchedule: any // Replace 'any' with a more specific type if possible
) => {
  // Reference to the user's document
  const userRef = doc(firestore, "users", uid);

  return runTransaction(firestore, async (transaction) => {
    const userDoc = await transaction.get(userRef);
    if (!userDoc.exists()) {
      throw new Error(`User with ID ${uid} does not exist`);
    }

    const schedules: any[] = userDoc.data()?.schedules; // Replace 'any' with the correct type
    const scheduleIndex = schedules.findIndex(
      (schedule) => schedule.name === oldName
    );

    if (scheduleIndex === -1) {
      throw new Error(`No schedule found with name: ${oldName}`);
    }

    // Modify only the desired schedule locally
    schedules[scheduleIndex] = renamedSchedule;

    // Update only the desired schedule in Firestore
    transaction.update(userRef, {
      [`schedules.${scheduleIndex}`]: renamedSchedule,
    });
  })
    .then(() => {
      console.log("Schedule updated successfully!");
    })
    .catch((error) => {
      console.error("Error updating schedule:", error);
      throw error;
    });
};

export const updateSchedule = async (
  uid: string,
  oldName: string,
  renamedSchedule: any // Replace 'any' with a more specific type if possible
) => {
  // Reference to the user's document
  const userRef = doc(firestore, "users", uid);

  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const schedules: any[] = userDoc.data()?.schedules; // Replace 'any' with the correct type
      const scheduleIndex = schedules.findIndex(
        (schedule) => schedule.name === oldName
      );

      if (scheduleIndex !== -1) {
        // Modify only the desired schedule locally
        schedules[scheduleIndex] = renamedSchedule;

        // Update only the desired schedule in Firestore
        await updateDoc(userRef, {
          [`schedules.${scheduleIndex}`]: renamedSchedule,
        });

        console.log("Schedule updated successfully!");
      } else {
        console.error("No schedule found with name:", oldName);
      }
    } else {
      console.error("No user document found for UID:", uid);
    }
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error;
  }
};

export const deleteSchedule = async (uid: string, scheduleName: string) => {
  // Reference to the user's document
  const userRef = doc(firestore, "users", uid);

  try {
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const schedules: Schedule[] = userDoc.data()?.schedules; // Replace 'any' with the correct type
      const newSchedules = (
        (schedule: any) => schedule.name !== scheduleName
      );

      // Update the schedules array in Firestore without the deleted schedule
      await updateDoc(userRef, { schedules: newSchedules });

      console.log("Schedule deleted successfully!");
    } else {
      console.error("No user document found for UID:", uid);
    }
  } catch (error) {
    console.error("Error deleting schedule:", error);
    throw error;
  }
};
