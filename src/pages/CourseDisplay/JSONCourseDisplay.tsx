import React, { useState, useEffect } from "react";
import {
  Course,
  Schedule,
  SectionWithCourse,
} from "../../components/CourseDisplay/CourseUI/CourseTypes";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses";
import Calendar from "../../components/CourseDisplay/Calendar/Calendar";
import CoursesHandler from "../../components/CourseDisplay/CoursesHandler/CoursesHandler";
import LLMChatPlaceholder from "../../components/LLMChat/LLMChatPlaceholder";
import LLMChat from "../../components/LLMChat/LLMChat";

import { AiOutlineClose } from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";

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

interface JSONCourseDisplayProps {
  selectedSchedule: string;
}

const JSONCourseDisplay: React.FC<JSONCourseDisplayProps> = ({
  selectedSchedule,
}) => {
  const [globalState, dispatch] = useStateValue();

  useEffect(() => {
    console.log("*Selected Schedule has changed to:", selectedSchedule);

    // Any other side-effects you want to perform when selectedSchedule changes
  }, [selectedSchedule]);

  // console.log("ALKJFDKLJFSJLFDSJ" + localStorage.getItem("selectedSchedule"));

  // selectedSchedule = useState(() => {
  //   const localSelectedSchedule =
  //     localStorage.getItem("selectedSchedule") || "";
  //   // const jsonSelectedSchedule = JSON.parse(localSelectedSchedule || "");
  //   return localSelectedSchedule;
  // });

  // console.log(localStorage.getItem("selectedSchedule"));

  // const selectedSchedule = useEffect(() => {
  //   JSON.parse(localStorage.getItem("selectedSchedule") || "");
  // }, []);

  const [schedules, setSchedules] = useState<Schedule[]>([]);

  const { container } = JSONCourseDisplayClasses;
  // Use the global state and synchronize with local storage
  const [courseHandlerVisible, setCourseHandlerVisible] = useLocalStorage(
    "isCourseHandlerVisible",
    globalState.courseHandlerVisible
  );
  const [calendarVisible, setCalendarVisible] = useLocalStorage(
    "isCalendarVisible",
    globalState.calendarVisible
  );
  // Initialize selectedSections based on the current selectedSchedule
  const [selectedSections, setSelectedSections] = useState<number[]>(() => {
    const schedule = schedules.find((s) => s.name === selectedSchedule);
    return schedule ? schedule.selectedSections : [];
  });

  // Update selectedSections when selectedSchedule changes
  useEffect(() => {
    const schedule = schedules.find((s) => s.name === selectedSchedule);
    setSelectedSections(schedule ? schedule.selectedSections : []);
  }, [selectedSchedule, schedules]);

  const [LLMChatVisible, setLLMChatVisible] = useLocalStorage(
    "isLLMChatVisible",
    globalState.LLMChatVisible
  );
  const [isWideScreen, setIsWideScreen] = useLocalStorage(
    "isWideScreen",
    globalState.isWideScreen
  );

  const handleHeaderClick = (option: string) => {
    switch (option) {
      case "Courses":
        setCourseHandlerVisible(true);
        setCalendarVisible(false);
        setLLMChatVisible(false);
        break;
      case "Calendar":
        setCourseHandlerVisible(false);
        setCalendarVisible(true);
        setLLMChatVisible(false);
        break;
      case "LLMChat":
        setCourseHandlerVisible(false);
        setCalendarVisible(false);
        setLLMChatVisible(true);
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
        setLLMChatVisible(false);
        setIsWideScreen(false);
      } else if (width >= 1075 && width < 1125) {
        setCourseHandlerVisible(true);
        setCalendarVisible(false);
        setLLMChatVisible(false);
        setIsWideScreen(false);
      } else {
        setCourseHandlerVisible(true);
        setCalendarVisible(true);
        setLLMChatVisible(false);
        setIsWideScreen(true);
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
    console.log("JSONCourseDisplay - Selected Sections:", selectedSections);
  }, [selectedSections]);

  const handleSectionsSelection = (section: SectionWithCourse) => {
    setSelectedSections((prev) => {
      if (prev.includes(section.classNumber)) {
        return prev.filter((classNum) => classNum !== section.classNumber);
      } else {
        return [...prev, section.classNumber];
      }
    });

    if (auth.currentUser) {
      console.log("Section Number: " + section.classNumber);
      console.log(
        "Index: " +
          schedules.findIndex((s: Schedule) => s.name === selectedSchedule)
      );
      // Determine the index of the currently active schedule
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
  };

  console.log("JSON Selected:", selectedSchedule);

  return (
    <div className="flex flex-col lg-xl:flex-row h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem] overflow-hidden">
      {/* Header for options */}
      <div className="lg-xl:hidden flex justify-center items-center bg-white dark:bg-gray-900 h-12 border-b border-gray-300 dark:border-gray-700">
        <button
          className={`px-4 py-2 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            courseHandlerVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("Courses")}
        >
          Courses
        </button>
        <button
          className={`px-4 py-4 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            calendarVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("Calendar")}
        >
          Calendar
        </button>
        <button
          className={`px-4 py-4 text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white ${
            LLMChatVisible ? "font-bold" : ""
          }`}
          onClick={() => handleHeaderClick("LLMChat")}
        >
          LLM Chat
        </button>
      </div>
      {/* Components */}
      <div className={`${container} ${courseHandlerVisible ? "" : "hidden"}`}>
        {courseHandlerVisible && (
          <CoursesHandler
            onSelectSection={handleSectionsSelection}
            selectedSchedule={selectedSchedule}
            // schedules={schedules}
          />
        )}
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div
          className={`flex-grow overflow-y-scroll bg-white dark:bg-gray-800 ${JSONCourseDisplayClasses.calendarContainer}`}
        >
          {calendarVisible && <Calendar selectedSections={selectedSections} />}
        </div>
        {/* Modern Icon Button to toggle LLMChat */}
        {isWideScreen && (
          <button
            className="absolute right-4 top-20 bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-lg shadow-md border border-gray-300 z-10"
            onClick={() => setLLMChatVisible(!LLMChatVisible)}
          >
            {LLMChatVisible ? (
              <AiOutlineClose size={20} />
            ) : (
              <BsChatLeftText size={20} />
            )}
          </button>
        )}

        {/* LLMChat Placeholder */}
        <div
          className={`${JSONCourseDisplayClasses.chatContainer}`}
          style={{
            flexBasis: LLMChatVisible ? "400px" : "0px", // Adjust 300px to your desired width
          }}
        >
          {/* <LLMChatPlaceholder /> */}
          <LLMChat />
        </div>
      </div>
    </div>
  );
};

export default JSONCourseDisplay;
