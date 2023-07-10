import React from "react";
import SideBar from "../../components/SideBar/Sidebar";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses"; // Import the styles
import CalendarUI from "../../components/Calendar/Calendar";
import { CalendarUIClasses } from "../../components/Calendar/CalendarUIClasses";
import CoursesHandler from "../../components/CoursesHandler/CoursesHandler";
import './CourseDisplay.css';

const JSONCourseDisplay: React.FC = () => {

  const {
    container,
  } = JSONCourseDisplayClasses;

  return (
    <div className="flex course-display">
      <SideBar />
      <div className={`${container} courses-handler`}>
        <CoursesHandler />
      </div>
      {/* <div className="course-filter">
        <CourseFilter />
      </div> */}
      <div className={`${CalendarUIClasses.mainContainer} flex calendar-ui`}>
        <CalendarUI />
      </div>
    </div>
  );

};

export default JSONCourseDisplay;
