import React from "react";
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase";
import jsonDataImport from "../courses/UF_Jun-30-2023_23_summer_clean.json";
import SideBar from "../components/SideBar/Sidebar";
import { courseServiceClasses } from "./courseServiceClasses";

const { page, title, container, text, button } = courseServiceClasses;

// Define a global set variable to store the course prefixes
const coursePrefixSet: Set<string> = new Set();

const jsonData = jsonDataImport as Array<any>;

const importDataToFirestore = async () => {
  const confirmation = window.confirm(
    "Are you sure you want to import data to Firestore? This action cannot be undone."
  );

  if (!confirmation) {
    return;
  }

  // Specify the location of where you want to store the data
  const basePath = "courses/UniversityOfFlorida/2023-Summer";

  // Loop through each course within the group
  for (const course of jsonData) {
    try {
      // Define a document path
      const courseCode = course.code;
      const courseName = course.name;
      let modifiedCourseName = courseName;
      const courseTerm = course.termInd;

      if (courseName.includes("/")) {
        modifiedCourseName = courseName.replace(/\//g, "!?");
      }

      const docPath = `${basePath}/${courseCode}-${modifiedCourseName}-${courseTerm}`;

      // Check if the document already exists
      const docSnapshot = await getDoc(doc(db, docPath));
      if (docSnapshot.exists()) {
        console.log(`Document already exists at: ${docPath}`);

        const sections = course.sections;
        const sectionArrayField = "sections";

        for (const section of sections) {
          await updateDoc(doc(db, docPath), {
            [sectionArrayField]: arrayUnion(section),
          });
        }

        continue; // Skip uploading the document and move to the next iteration
      }

      // Modify the course code to include an array with default code and prefix
      const modifiedCourseCode = [];
      let prefix = "";
      for (const char of courseCode) {
        if (!isNaN(char)) {
          break; // Exit the loop when the first number is encountered
        }
        prefix += char;
      }
      modifiedCourseCode.push(courseCode, prefix);

      // Add the course prefix to the global set
      coursePrefixSet.add(prefix);

      // Update the course object with the modified code
      const modifiedCourse = {
        ...course,
        code: modifiedCourseCode,
      };

      // Set the modified course data at the specified document path
      await setDoc(doc(db, docPath), modifiedCourse);
      console.log(`Document written at: ${docPath}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
};

const CourseService = () => {
  return (
    <>
      <SideBar />
      <div className={page}>
        <div className={container}>
          <h1 className={title}>Importing Data to Firestore</h1>
          <p className={text}>
            This page is used to import data to Firestore. Please do not use
            this page unless you know what you are doing.
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
              importDataToFirestore();
            }}
            className={button}
          >
            Import Data to Firestore
          </button>
        </div>
      </div>
    </>
  );
};

export { coursePrefixSet };

export default CourseService;
