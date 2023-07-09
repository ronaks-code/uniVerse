// App.tsx
import React from 'react';
import CoursesHandler from './CoursesHandler';
import CalendarUI from './CalendarUI';
import CourseFilter from './CourseFilter';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <CoursesHandler />
      <CourseFilter />
      <CalendarUI />
    </div>
  );
}

export default App;



// App.css
.app-container {
  display: flex;
}

.courses-handler {
  width: 25%;
  padding: 1rem;
}

.course-filter {
  width: 15%;
  padding: 1rem;
}

.calendar-ui {
  width: 60%;
  padding: 1rem;
}


// CoursesHander.tsx
import React from 'react';
import './App.css';

class CoursesHandler extends React.Component {
  // Logic for adding/removing courses goes here

  render() {
    return (
      <div className="courses-handler bg-white dark:bg-gray-800 rounded-md p-4 shadow-md transition-shadow duration-300">
        {/* Add/Remove Courses UI goes here */}
      </div>
    );
  }
}

export default CoursesHandler;


// CourseFilter.tsx
import React from 'react';
import './App.css';

class CourseFilter extends React.Component {
  // Logic for filtering courses goes here

  render() {
    return (
      <div className="course-filter bg-white dark:bg-gray-800 rounded-md p-4 shadow-md transition-shadow duration-300">
        {/* Course Filter UI goes here */}
      </div>
    );
  }
}

export default CourseFilter;


// CalendarUI.tsx
import React from 'react';
import DayColumn from './DayColumn';
import { CalendarUIClasses } from './CalendarUIClasses';
import './App.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

class CalendarUI extends React.Component {
  render() {
    return (
      <div className={`calendar-ui bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 m-2 sm:m-4 transition-colors duration-200 ease-in-out w-full sm:min-w-[95%] max-w-full`}>
        {days.map((day) => (
          <DayColumn key={day} day={day} />
        ))}
      </div>
    );
  }
}

export default CalendarUI;
