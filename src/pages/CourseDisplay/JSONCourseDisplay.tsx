import React, { useState, useEffect } from "react";
import { Course, SectionWithCourseCode } from "../../components/CourseDisplay/CourseUI/CourseTypes";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses";
import Calendar from "../../components/CourseDisplay/Calendar/Calendar";
// import Calendar from "@toast-ui/react-calendar"
import CalendarNew from "../../components/Tester/Calendar";
import CoursesHandler from "../../components/CourseDisplay/CoursesHandler/CoursesHandler";
// import CourseFilter from "../../components/CourseFilter/CourseFilter";

interface CourseDropdownProps {
  course: Course;
  selectedSections?: SectionWithCourseCode[];
  setSelectedSections?: React.Dispatch<
    React.SetStateAction<SectionWithCourseCode[]>
  >;
}

const JSONCourseDisplay: React.FC = () => {
  const { container } = JSONCourseDisplayClasses;
  const [isCourseHandlerVisible, setCourseHandlerVisible] = useState(true);
  // const [isCourseFilterVisible, setCourseFilterVisible] = useState(false);
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedSections, setSelectedSections] = useState<SectionWithCourseCode[]>([]);

  console.log("In JSONCourseDisplay, selectedSections is", selectedSections);

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
        {isCourseHandlerVisible && <CoursesHandler />}
      </div>
      {/* <div className={`course-filter ${isCourseFilterVisible ? "" : "hidden"}`}>
        {isCourseFilterVisible && <CourseFilter />}
      </div> */}
      <div
        className={`overflow-y-scroll bg-white dark:bg-gray-800 transition-colors duration-200 ease-in-out w-full ${
          isCalendarVisible ? "" : "hidden"
        }`}
      >
        {isCalendarVisible && <Calendar selectedSections={selectedSections} setSelectedSections={setSelectedSections} />}
        {/* {isCalendarVisible && <CalendarNew />} */}
      </div>
    </div>
  );
};

export default JSONCourseDisplay;
