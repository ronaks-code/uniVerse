import React from "react";
import { CalendarStyles } from "./CalendarUIClasses";
import { SectionWithCourseCode } from "../CourseUI/CourseTypes";

type CardProps = {
  code: string;
  meetTimeBegin: string;
  meetTimeEnd: string;
  style: React.CSSProperties;
};

const Card: React.FC<CardProps> = ({
  code,
  meetTimeBegin,
  meetTimeEnd,
  style,
}) => (
  <div
    style={{
      backgroundColor: "#e0e0e0", // Replace with your preferred color
      width: "100%",
      border: "1px solid #000",
      borderRadius: "10px",
      padding: "10px",
      color: "#000",
      ...style,
    }}
  >
    <strong>{code}</strong> {meetTimeBegin} - {meetTimeEnd}
  </div>
);

type DayColumnProps = {
  day: string;
  selectedSections: SectionWithCourseCode[];
  timeSlots: string[];
};

class DayColumn extends React.Component<DayColumnProps> {
  calendarRef = React.createRef<HTMLDivElement>();
  state = {
    calendarHeight: null,
  };

  componentDidMount() {
    if (this.calendarRef.current) {
      this.setState({
        calendarHeight: this.calendarRef.current.getBoundingClientRect().height,
      });
    }
  }
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

    // Starting time of the calendar
    const calendarStartTime = Number(this.props.timeSlots[0].split("am")[0]);

    return (
      (hourNum + minuteFraction - calendarStartTime) /
      this.props.timeSlots.length
    );
  }

  // Function to check if two time ranges overlap
  timeRangesOverlap(
    start1: number,
    end1: number,
    start2: number,
    end2: number
  ) {
    return start1 < end2 && start2 < end1;
  }

  // Function to group overlapping cards
  groupOverlappingCards(cards: any[]) {
    const groups: any[][] = [];
    cards.forEach((card) => {
      let placed = false;
      for (const group of groups) {
        if (
          group.some((groupCard) =>
            this.timeRangesOverlap(
              groupCard.startCalendar,
              groupCard.endCalendar,
              card.startCalendar,
              card.endCalendar
            )
          )
        ) {
          group.push(card);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groups.push([card]);
      }
    });
    return groups;
  }

  render() {
    const daySections = this.props.selectedSections.filter((section) =>
      section.meetTimes.some((meetingTime) =>
        meetingTime.meetDays.includes(this.props.day)
      )
    );

    // This is the window height + 16px * 80 (80rem)
    const calendarHeight = 1280;
    const totalSlots = this.props.timeSlots.length;
    console.log("totalSlots:", totalSlots);

    const sectionCards = daySections
      .flatMap((section, index) =>
        section.meetTimes.map((meetTime, meetIndex) => {
          if (!meetTime.meetDays.includes(this.props.day)) {
            return null;
          }

          const startFraction = this.timeStringToDayFraction(
            meetTime.meetTimeBegin
          );
          console.log("startFraction:", startFraction);
          const endFraction = this.timeStringToDayFraction(
            meetTime.meetTimeEnd
          );
          console.log("endFraction:", endFraction);

          const startCalendar = startFraction * calendarHeight;
          console.log("startSlot:", startCalendar);
          const endCalendar = endFraction * calendarHeight;
          console.log("endSlot:", endCalendar);

          const heightOfCard = endCalendar - startCalendar;

          return {
            key: `${index}-${meetIndex}`,
            section,
            meetTime,
            startCalendar,
            endCalendar,
            heightOfCard,
          };
        })
      )
      .filter(Boolean);

    const overlappingGroups = this.groupOverlappingCards(sectionCards);

    return (
      <div
        className={CalendarStyles.day}
        ref={this.calendarRef}
        style={{ position: "relative" }}
      >
        <div className={CalendarStyles.label}>{this.props.day}</div>
        <div className={`grid grid-rows-${totalSlots}`}>
          {overlappingGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              style={{ position: "absolute", width: "100%" }}
            >
              {group.map((card, cardIndex) => (
                <div
                  key={card.key}
                  style={{
                    position: "absolute",
                    width: `${100 / group.length}%`,
                    left: `${(100 / group.length) * cardIndex}%`,
                    top: card.startCalendar + "px", // Set the top property instead of marginTop
                  }}
                >
                  <Card
                    code={card.section.code}
                    meetTimeBegin={card.meetTime.meetTimeBegin}
                    meetTimeEnd={card.meetTime.meetTimeEnd}
                    style={{
                      height: card.heightOfCard + "px",
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default DayColumn;
