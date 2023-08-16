import React, { useEffect, useState } from "react";
import DayColumn from "./DayColumn";
import { CalendarStyles } from "./CalendarUIClasses";
import { SectionWithCourseCode } from "../CourseUI/CourseTypes";

const days = ["M", "T", "W", "R", "F"];

export const timeSlots = [
  "7am",
  "8am",
  "9am",
  "10am",
  "11am",
  "12pm",
  "1pm",
  "2pm",
  "3pm",
  "4pm",
  "5pm",
  "6pm",
  "7pm",
  "8pm",
  "9pm",
  "10pm",
];

type CalendarProps = {
  selectedSections: SectionWithCourseCode[];
};

const Calendar: React.FC<CalendarProps> = ({ selectedSections }) => {
  useEffect(() => {
    console.log("Calendar - Selected Sections:", selectedSections);
  }, [selectedSections]);

  const renderTimeSlots = () => {
    return timeSlots.map((time) => (
      <div className={CalendarStyles.time} key={time}>
        <span className={CalendarStyles.label}>{time}</span>
      </div>
    ));
  };

  const renderDayColumns = () => {
    return days.map((day) => (
      <DayColumn
        key={day}
        day={day}
        selectedSections={selectedSections}
        timeSlots={timeSlots}
      />
    ));
  };

  return (
    <div className={`${CalendarStyles.calendar}`}>
      <div className={CalendarStyles.times}>{renderTimeSlots()}</div>
      <div className={CalendarStyles.days}>{renderDayColumns()}</div>
      <div className={CalendarStyles.meetings}></div>
    </div>
  );
};

export default Calendar;
