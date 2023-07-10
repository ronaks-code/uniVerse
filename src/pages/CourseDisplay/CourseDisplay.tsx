import React from 'react';
import CoursesHandler from '../../components/CoursesHandler/CoursesHandler';
import CalendarUI from '../../components/Calendar/Calendar';
import CourseFilter from '../../components/CourseFilter';
import './CourseDisplay.css';

function CourseDisplay() {
  return (
    <div className="course-display">
      <div className="courses-handler">
        <CoursesHandler />
      </div>
      <div className="course-filter">
        <CourseFilter />
      </div>
      <div className="calendar-ui">
        <CalendarUI />
      </div>
    </div>
  );
}

export default CourseDisplay;
