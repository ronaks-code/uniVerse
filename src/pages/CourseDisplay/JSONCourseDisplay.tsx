import React from "react";
import SideBar from "../../components/SideBar/Sidebar";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses";
import Calendar from "../../components/Calendar/Calendar";
import CalendarNew from "../../components/Tester/Calendar";
import { CalendarUIClasses } from "../../components/Calendar/CalendarUIClasses";
import CoursesHandler from "../../components/CoursesHandler/CoursesHandler";
// import CourseFilter from "../../components/CourseFilter/CourseFilter"; // Add CourseFilter component
import "./CourseDisplay.css";

const JSONCourseDisplay: React.FC = () => {
  const { container } = JSONCourseDisplayClasses;

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
        <Calendar />
        {/* <CalendarNew /> */}
      </div>
    </div>
  );
};

export default JSONCourseDisplay;

// import React from "react";
// import SideBar from "../../components/SideBar/Sidebar";
// import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses"; // Import the styles
// import Calendar from "../../components/Calendar/Calendar";
// import { CalendarUIClasses } from "../../components/Calendar/CalendarUIClasses";
// import CoursesHandler from "../../components/CoursesHandler/CoursesHandler";
// import './CourseDisplay.css';

// const JSONCourseDisplay: React.FC = () => {

//   const {
//     container,
//   } = JSONCourseDisplayClasses;

//   return (
//     <div className="flex course-display">
//       <SideBar />
//       <div className={`${container} courses-handler`}>
//         <CoursesHandler />
//       </div>
//       {/* <div className="course-filter">
//         <CourseFilter />
//       </div> */}
//       <div className={`${CalendarUIClasses.mainContainer} flex calendar-ui`}>
//         <Calendar />
//       </div>
//     </div>
//   );

// };

// export default JSONCourseDisplay;
