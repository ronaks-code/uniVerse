import React, { Dispatch, SetStateAction } from "react";
import DayColumn from "./DayColumn";
import { CalendarStyles } from "./CalendarUIClasses";
import "./stylesheet.scss";
import { SectionWithCourseCode } from "../CourseUI/CourseTypes";

const days = ["M", "T", "W", "R", "F"];

type CalendarProps = {
  selectedSections: SectionWithCourseCode[];
  setSelectedSections: Dispatch<SetStateAction<SectionWithCourseCode[]>>;
};

class Calendar extends React.Component<CalendarProps, {}> {
  renderTimeSlots() {
    const timeSlots = [
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
    return timeSlots.map((time) => (
      <div className={CalendarStyles.time} key={time}>
        <span className={CalendarStyles.label}>{time}</span>
      </div>
    ));
  }

  renderDayColumns() {
    console.log(
      "In Calendar, selectedSections is",
      this.props.selectedSections
    );

    // If selectedSections or setSelectedSections are not provided in the props, use default values
    return days.map((day) => (
      <DayColumn
        key={day}
        day={day}
        selectedSections={this.props.selectedSections}
        setSelectedSections={this.props.setSelectedSections}
      />
    ));
  }

  render() {
    return (
      <div className={`${CalendarStyles.calendar}`}>
        <div className={CalendarStyles.times}>{this.renderTimeSlots()}</div>
        <div className={CalendarStyles.days}>{this.renderDayColumns()}</div>
        <div className={CalendarStyles.meetings}></div>
      </div>
    );
  }
}

export default Calendar;
