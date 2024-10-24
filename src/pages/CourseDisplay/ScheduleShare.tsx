import React, { useState, useEffect } from "react";
import {
  Course,
  Schedule,
  SectionWithCourseWithoutSectionsArray,
} from "../../components/CourseDisplay/CourseUI/CourseTypes";
import { ScheduleShareClasses } from "./ScheduleShareClasses";
import Calendar from "../../components/CourseDisplay/Calendar/Calendar";
// import CalendarNew from "../../components/CourseDisplay/Calendar/WeekCalendar";
import CoursesHandler from "../../components/CourseDisplay/CoursesHandler/CoursesHandler";
// import CourseFilter from "../../components/CourseFilter/CourseFilter";

// Import global state and custom hook
import { useStateValue } from "../../context/globalState";
import useLocalStorage from "../../hooks/useLocalStorage";

import {
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { auth, firestore } from "../../services/firebase";

const updateSelectedSectionsInFirebase = async (
  sectionNumber: number,
  scheduleIndex: number
) => {
  // Retrieve the userId within the function
  const userId = getAuth().currentUser?.email || localStorage.getItem("userId");

  if (!userId) {
    console.error("User ID is not available.");
    return;
  }

  const userDocRef = doc(firestore, "users", userId);

  // Fetch the current schedules array
  const docSnapshot = await getDoc(userDocRef);
  if (!docSnapshot.exists()) {
    console.error("Document does not exist.");
    return;
  }

  const currentSchedules = docSnapshot.data()?.schedules || [];
  const scheduleToUpdate = currentSchedules[scheduleIndex];

  if (!scheduleToUpdate) {
    console.error(`Schedule at index ${scheduleIndex} not found.`);
    return;
  }

  // Create the updated schedule
  const updatedSchedule: Schedule = {
    ...scheduleToUpdate,
    selectedSections: [
      ...(scheduleToUpdate.selectedSections || []),
      sectionNumber,
    ],
  };

  // Use arrayRemove and arrayUnion to update the schedules array
  await updateDoc(userDocRef, {
    schedules: updatedSchedule,
  });
};

interface ScheduleShareProps {
  selectedSchedule: string;
}

const ScheduleShare: React.FC<ScheduleShareProps> = ({ selectedSchedule }) => {
  const { container } = ScheduleShareClasses;
  const [isCourseHandlerVisible, setCourseHandlerVisible] = useState(true);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedSectionsNumbers, setSelectedSectionsNumbers] = useState<
    number[]
  >([]);

  const [selectedSections, setSelectedSections] = useLocalStorage<
    SectionWithCourseWithoutSectionsArray[]
  >(`selectedSections-${selectedSchedule}`, []);

  const [selected, setSelected] = useLocalStorage("selected", "");
  const [schedules, setSchedules] = useLocalStorage("schedules", []);

  const handleHeaderClick = (option: string) => {
    switch (option) {
      case "Courses":
        setCourseHandlerVisible(true);
        // setCourseFilterVisible(false);
        setCalendarVisible(false);
        break;
      // case "Combinations":
      //   setCourseHandlerVisible(false);
      //   setCourseFilterVisible(true);
      //   setCalendarVisible(false);
      //   break;
      case "Calendar":
        setCourseHandlerVisible(false);
        // setCourseFilterVisible(false);
        setCalendarVisible(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    // Listen to window resize event to update the header visibility based on screen width
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 1075) {
        setCourseHandlerVisible(true);
        setCalendarVisible(false);
      } else if (width >= 1075 && width < 1125) {
        setCourseHandlerVisible(true);
        setCalendarVisible(false);
      } else {
        setCourseHandlerVisible(true);
        setCalendarVisible(true);
      }
    };

    handleResize(); // Call immediately to set initial state
    window.addEventListener("resize", handleResize);
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    console.log(
      "JSONCourseDisplay - Selected Sections:",
      selectedSectionsNumbers
    );
  }, [selectedSectionsNumbers]);

  const onSectionSelect = (section: SectionWithCourseWithoutSectionsArray) => {
    // Update selectedSectionsNumbers
    setSelectedSectionsNumbers((prevNumbers) => {
      if (prevNumbers.includes(section.classNumber)) {
        return prevNumbers.filter((num) => num !== section.classNumber);
      } else {
        return [...prevNumbers, section.classNumber];
      }
    });

    // Update selectedSections
    setSelectedSections((prevSections) => {
      if (prevSections.some((sec) => sec.classNumber === section.classNumber)) {
        return prevSections.filter(
          (sec) => sec.classNumber !== section.classNumber
        );
      } else {
        return [...prevSections, section];
      }
    });

    // Update Firebase if a user is authenticated
    if (auth.currentUser) {
      console.log("Section Number: " + section.classNumber);
      const currentScheduleIndex = schedules.findIndex(
        (schedule: Schedule) => schedule.name === selectedSchedule
      );
      if (currentScheduleIndex !== -1) {
        updateSelectedSectionsInFirebase(
          section.classNumber,
          currentScheduleIndex
        );
      } else {
        console.error("Current active schedule not found in schedules array.");
      }
    }

    // Update Firebase logic here
    // ...
  };

  return (
    <div className="flex flex-col lg-xl:flex-row h-screen max-h-[calc(100vh] overflow-hidden">
      {/* Header for options */}
      <div className="lg-xl:hidden flex justify-center items-center bg-white dark:bg-gray-900 h-12 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            isCourseHandlerVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("Courses")}
        >
          Courses
        </button>
        {/* <button
          className={`px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            isCourseFilterVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("Combinations")}
        >
          Combinations
        </button> */}
        <button
          className={`px-4 py-4 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            isCalendarVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("Calendar")}
        >
          Calendar
        </button>
      </div>
      {/* Components */}
      <div
        className={`${container} ${
          isCourseHandlerVisible ? "" : "hidden"
        } flex-grow`}
      >
        {/* {isCourseHandlerVisible && (
          <CoursesHandler
            onSectionSelect={onSectionSelect}

            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            selectedSectionsNumbers={selectedSectionsNumbers}
            setSelectedSectionsNumbers={setSelectedSectionsNumbers}
            selectedSchedule={selected}
            // schedules={schedules}
          />
        )} */}
      </div>
      {/* <div className={`course-filter ${isCourseFilterVisible ? "" : "hidden"}`}>
        {isCourseFilterVisible && <CourseFilter />}
      </div> */}
      <div
        className={`overflow-y-scroll bg-white dark:bg-gray-800 transition-colors duration-200 ease-in-out w-full ${
          isCalendarVisible ? "" : "hidden"
        }`}
      >
        {isCalendarVisible && (
          <Calendar
            selectedSchedule={selectedSchedule}
            selectedSections={selectedSections}
          />
        )}
        {/* {isCalendarVisible && <CalendarNew />} */}
      </div>
    </div>
  );
};

export default ScheduleShare;
