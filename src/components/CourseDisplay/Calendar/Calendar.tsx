import React, { useEffect, useState } from "react";
import DayColumn from "./DayColumn";
import { CalendarStyles } from "./CalendarUIClasses";
import { Section, Course, SectionWithCourse } from "../CourseUI/CourseTypes";
import jsonData from "../../../courses/UF_Jun-30-2023_23_summer_clean.json";

// Assuming jsonData is an array of courses directly
const courses: Course[] = jsonData as Course[];

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
  selectedSections: number[];
};

const Calendar: React.FC<CalendarProps> = ({ selectedSections }) => {
  // Function to get the full details of a section based on its classNumber
  const getSectionDetails = (classNumber: number): Section | null => {
    for (const course of courses) {
      // Now using the correctly typed 'courses' variable
      for (const section of course.sections) {
        if (section.classNumber === classNumber) {
          return section;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    // Log the full details of selected sections when they change
    if (selectedSections.length > 0) {
      const details = selectedSections.map((sectionNumber) =>
        getSectionDetails(sectionNumber)
      );
      console.log("Full Section Details:", details);
    }
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
