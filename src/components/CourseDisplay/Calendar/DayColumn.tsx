import React, { Dispatch, SetStateAction } from "react";
import TimeSlot from "./TimeSlot";
import { CalendarStyles } from "./CalendarUIClasses";
import { Section, SectionWithCourseCode } from "../CourseUI/CourseTypes";

type DayColumnProps = {
  day: string;
  selectedSections: SectionWithCourseCode[];
  setSelectedSections: Dispatch<SetStateAction<SectionWithCourseCode[]>>;
};

class DayColumn extends React.Component<DayColumnProps> {
  // Helper function to convert time string to 24-hour format
  timeStringToNumber(timeString: string): number {
    // This function should return a number
    const [time, period] = timeString.split(/(?<=\d)(?=[a-zA-Z])/); // Split time and period
    let hour = parseInt(time); // Parse hour as integer
    if (period.toLowerCase() === "pm" && hour !== 12) {
      hour += 12;
    }
    return hour;
  }

  render() {
    const hours = [];
    for (let hour = 7; hour < 22; hour++) {
      hours.push(<TimeSlot key={hour} hour={99} />);
    }

    // Filter out the selected sections for this day
    const daySections = this.props.selectedSections.filter((section) =>
      section.meetTimes.some((meetingTime) =>
        meetingTime.meetDays.includes(this.props.day)
      )
    );

    // Generate cards for the selected sections
    const sectionCards = daySections.map((section, index) => (
      // Replace this with your actual Card component
      <div
        key={index}
        style={{
          gridRow: `${this.timeStringToNumber(
            section.meetTimes[0].meetTimeBegin
          )} / span ${
            this.timeStringToNumber(section.meetTimes[0].meetTimeEnd) -
            this.timeStringToNumber(section.meetTimes[0].meetTimeBegin)
          }`,
        }}
      >
        {section.code} {section.meetTimes[0].meetTimeBegin}-
        {section.meetTimes[0].meetTimeEnd}
      </div>
    ));

    return (
      <div className="day">
        <div className={CalendarStyles.label}>{this.props.day}</div>
        <div className="grid grid-rows-16 min-w-max">
          {hours}
          {sectionCards}
        </div>
      </div>
    );
  }
}

export default DayColumn;

// import React from "react";
// import TimeSlot from "./TimeSlot";
// import { CalendarUIClasses } from "./CalendarUIClasses";

// interface DayColumnProps {
//   day: string;
// }

// class DayColumn extends React.Component<DayColumnProps> {
//   render() {
//     const hours = [];
//     for (let hour = 7; hour < 22; hour++) {
//       hours.push(<TimeSlot key={hour} hour={99} />);
//     }

//     return (
//       <div className={CalendarUIClasses.day}>
//         <div className={CalendarUIClasses.label}>{this.props.day}</div>
//         <div className="grid grid-rows-16 min-w-max">
//           {hours}
//         </div>
//       </div>
//     );
//   }
// }

// export default DayColumn;
