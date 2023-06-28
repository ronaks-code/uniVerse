import React from 'react';
import { doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import jsonDataImport from "../courses/Jun-15-2023_23_summer.json";
import SideBar from '../components/SideBar/Sidebar';

const jsonData = jsonDataImport as Array<{ COURSES: any[] }>;

const importDataToFirestore = async () => {
  const confirmation = window.confirm("Are you sure you want to import data to Firestore? This action cannot be undone.");

  if (!confirmation) {
    return;
  }

  // Specify the location of where you want to store the data
  const basePath = "courses/UniversityOfFlorida/2023-Summer";

  // Loop through each group of courses in the JSON data
  for (const group of jsonData) {
    const courses = group.COURSES;

    // Loop through each course within the group
    for (const course of courses) {
      try {
        // Define a document path
        const courseCode = course.code;
        const docPath = `${basePath}/${courseCode}`;

        // Set the course data at the specified document path
        await setDoc(doc(db, docPath), course);
        console.log(`Document written at: ${docPath}`);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  }
};

const CourseService = () => {
  return (
    <>
      <SideBar />
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-semibold mb-4">Importing Data to Firestore</h1>
          <p className="mb-4 text-gray-600">
            This page is used to import data to Firestore. Please do not use this page unless you know what you are doing.
          </p>
          <p className="mb-4 text-center text-red-600">
            This page will overwrite any existing data in Firestore.
            <br />
            <br />
            <p className="mb-4 text-center font-serif font-extrabold text-red-600">
              CURRENTLY THIS PAGE IS NOT WORKING. PLEASE DO NOT USE.
            </p>
          </p>
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to import data to Firestore? This action cannot be undone.")) {
                importDataToFirestore();
              }
            }}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Import Data to Firestore
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseService;
