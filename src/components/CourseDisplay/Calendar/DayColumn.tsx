import React from "react";
import TimeSlot from "./TimeSlot";
import { CalendarStyles } from "./CalendarUIClasses";
import { Section, SectionWithCourseCode } from "../CourseUI/CourseTypes";

type CardProps = {
  code: string;
  meetTimeBegin: string;
  meetTimeEnd: string;
  style: React.CSSProperties;
};

const Card: React.FC<CardProps> = ({ code, meetTimeBegin, meetTimeEnd, style }) => (
  <div
    style={{
      backgroundColor: "#e0e0e0", // Replace with your preferred color
      border: "1px solid #000",
      borderRadius: "5px",
      padding: "10px",
      margin: "5px",
      ...style,
    }}
  >
    <strong>{code}</strong> {meetTimeBegin}-{meetTimeEnd}
  </div>
);

type DayColumnProps = {
  day: string;
  selectedSections: SectionWithCourseCode[];
};

class DayColumn extends React.Component<DayColumnProps> {
  // Helper function to convert time string to a percentage of the day
  timeStringToDayFraction(time: string) {
    // Split the time string into components
    const [hourMin, period] = time.split(" ");
    const [hour, minute] = hourMin.split(":");

    // Convert the hour to a number
    let hourNum = Number(hour);

    // Adjust the hour based on the period
    if (period === "PM" && hourNum !== 12) {
      hourNum += 12;
    } else if (period === "AM" && hourNum === 12) {
      hourNum = 0;
    }

    // Convert the minute to a fraction of an hour
    const minuteFraction = Number(minute) / 60;

    // Calculate the time as a fraction of the day
    const dayFraction = (hourNum + minuteFraction) / 24;

    // Return the day fraction
    return dayFraction;
  }

  render() {
    // Filter out the selected sections for this day
    const daySections = this.props.selectedSections.filter((section) =>
      section.meetTimes.some((meetingTime) =>
        meetingTime.meetDays.includes(this.props.day)
      )
    );

    // Generate cards for the selected sections
    const sectionCards = daySections
      .flatMap((section, index) =>
        section.meetTimes.map((meetTime, meetIndex) => {
          if (!meetTime.meetDays.includes(this.props.day)) {
            return null; // Don't render a card if the meet time doesn't include the current day
          }

          return (
            <Card
              key={`${index}-${meetIndex}`} // Combine the section index and meet time index to create a unique key
              code={section.code}
              meetTimeBegin={meetTime.meetTimeBegin}
              meetTimeEnd={meetTime.meetTimeEnd}
              style={{
                gridRowStart: `${this.timeStringToDayFraction(
                  meetTime.meetTimeBegin
                ) * 100}%`,
                gridRowEnd: `${this.timeStringToDayFraction(
                  meetTime.meetTimeEnd
                ) * 100}%`,
              }}
            />
          );
        })
      )
      .filter(Boolean); // Filter out null values

    return (
      <div className="day">
        <div className={CalendarStyles.label}>{this.props.day}</div>
        <div className="grid grid-rows-60 min-w-max">
          {sectionCards}
        </div>
      </div>
    );
  }
}

export default DayColumn;
