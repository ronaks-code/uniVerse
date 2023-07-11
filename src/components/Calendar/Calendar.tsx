import React from "react";
import DayColumn from "./DayColumn";
import TimeSlot from "./TimeSlot";
import { CalendarUIClasses } from "./CalendarUIClasses";

const days = ["M", "T", "W", "R", "F"];

class Calendar extends React.Component {
  render() {
    return (
      <div className={`${CalendarUIClasses.calendar} bg-white dark:bg-gray-800`}>
        <div className={`${CalendarUIClasses.timeColumn} ${CalendarUIClasses.dayColumn}`}>
          <div className={'h-10 flex items-center justify-center font-semibold text-gray-900 dark:text-gray-100 text-sm'}></div>
          {renderTimeSlots()}
        </div>
        {days.map((day) => (
          <DayColumn key={day} day={day} />
        ))}
      </div>
    );
  }
}

function renderTimeSlots() {
  const hours = [];
  for (let hour = 7; hour < 22; hour++) {
    hours.push(
      <TimeSlot key={hour} hour={hour} />
    );
  }
  return hours;
}

export default Calendar;
