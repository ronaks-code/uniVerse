import React, { useState, useEffect } from "react";
import {
  Course,
  SectionWithCourse,
} from "../../components/CourseDisplay/CourseUI/CourseTypes";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses";
import Calendar from "../../components/CourseDisplay/Calendar/Calendar";
import CoursesHandler from "../../components/CourseDisplay/CoursesHandler/CoursesHandler";
import LLMChatPlaceholder from "../../components/LLMChat/LLMChatPlaceholder";

import { AiOutlineClose } from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";

// Import global state and custom hook
import { useStateValue } from "../../context/globalState";
import useLocalStorage from "../../hooks/useLocalStorage";

const JSONCourseDisplay: React.FC = () => {
  const [globalState, dispatch] = useStateValue();

  const { container } = JSONCourseDisplayClasses;
  // Use the global state and synchronize with local storage
  const [courseHandlerVisible, setCourseHandlerVisible] = useLocalStorage("isCourseHandlerVisible", globalState.courseHandlerVisible);
  const [calendarVisible, setCalendarVisible] = useLocalStorage("isCalendarVisible", globalState.calendarVisible);
  const [selectedSections, setSelectedSections] = useLocalStorage("selectedSections", globalState.selectedSections);
  const [LLMChatVisible, setLLMChatVisible] = useLocalStorage("isLLMChatVisible", globalState.LLMChatVisible);
  const [isWideScreen, setIsWideScreen] = useLocalStorage("isWideScreen", globalState.isWideScreen);

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
        setLLMChatVisible(true);
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
      if (prev.some((s) => s.number === section.number)) {
        return prev.filter((s) => s.number !== section.number);
      } else {
        return [...prev, section];
      }
    });
  };

  return (
    <div className="flex flex-col lg-xl:flex-row h-screen max-h-[calc(100vh] overflow-hidden">
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
          <CoursesHandler onSelectSection={handleSectionsSelection} />
        )}
      </div>
      <div className="flex flex-grow overflow-hidden">
        <div
          className={`overflow-y-scroll bg-white dark:bg-gray-800 transition-all duration-500 ease-in-out ${JSONCourseDisplayClasses.calendarContainer}`}
          style={{
            flexBasis: LLMChatVisible ? "100%" : "100%",
          }}
        >
          {calendarVisible && (
            <Calendar selectedSections={selectedSections} />
          )}

          {/* Modern Icon Button to toggle LLMChat */}
          {isWideScreen && (
            <button
              className={`absolute right-4 top-20 bg-gray-900 hover:bg-gray-800 text-white p-2 rounded-lg shadow-md border border-gray-300 transition-transform duration-500 ease-in-out z-10`}
              onClick={() => setLLMChatVisible(!LLMChatVisible)}
            >
              {LLMChatVisible ? (
                <AiOutlineClose size={20} />
              ) : (
                <BsChatLeftText size={20} />
              )}
            </button>
          )}
        </div>
        {/* LLMChat Placeholder */}
        <div
          className={`transform transition-transform duration-500 ease-in-out overflow-hidden ${JSONCourseDisplayClasses.chatContainer}`}
          style={{
            display:
              window.innerWidth >= 1125 || !LLMChatVisible ? "none" : "block",
          }}
        >
          <LLMChatPlaceholder />
        </div>
      </div>
    </div>
  );
};

export default JSONCourseDisplay;
