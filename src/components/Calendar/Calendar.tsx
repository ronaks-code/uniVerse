import React from "react";
import DayColumn from "./DayColumn";
import { CalendarUIClasses } from "./CalendarUIClasses";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const Calendar: React.FC = () => {
  return (
    <div className={`${CalendarUIClasses.calendar} bg-white dark:bg-gray-800`}>
      {days.map((day) => (
        <DayColumn key={day} day={day} />
      ))}
    </div>
  );
};

export default Calendar;

// import React from "react";
// import DayColumn from "./DayColumn";
// import { CalendarUIClasses } from "./CalendarUIClasses";

// const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

// class Calendar extends React.Component {
//   render() {
//     return (
//       <div className={`${CalendarUIClasses.calendar} bg-white dark:bg-gray-800`}>
//         {days.map((day) => (
//           <DayColumn key={day} day={day} />
//         ))}
//       </div>
//     );
//   }
// }

// export default Calendar;
