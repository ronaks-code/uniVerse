import React from "react";
import { CalendarStyles } from "./CalendarUIClasses";
import { SectionWithCourse } from "../CourseUI/CourseTypes";

type CardProps = {
  name: string;
  code: string;
  courseId: string;
  meetTimeBegin: string;
  meetTimeEnd: string;
  meetBuilding: string;
  meetBldgCode: string;
  instructors?: string[];
  credits: number;
  style: React.CSSProperties;
};

// Helper function to format the course code
const formatCourseCode = (code: string) => {
  const match = code.match(/^([a-zA-Z]+)(\d+[a-zA-Z]*)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return code;
};

// Helper function to format the instructor name
const capitalizeName = (name: string) => {
  return name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const Card: React.FC<CardProps> = ({
  name,
  code,
  courseId,
  meetTimeBegin,
  meetTimeEnd,
  meetBuilding,
  meetBldgCode,
  instructors,
  credits,
  style,
}) => {
  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        // position: "absolute",
        backgroundColor: "#e0e0e0", // Replace with your preferred color
        width: "100%",
        border: "1px solid #000",
        borderRadius: "10px",
        padding: "10px",
        color: "#000",
        fontSize: "0.8rem",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...style,
      }}
    >
      {hovered && (
        <>
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[107%] z-10"
            style={{
              background: 'rgba(0, 0, 0, 0.7)',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              border: '1px solid #333',
              borderRadius: '5px',
              padding: '10px',
              width: '280px',
              transition: 'all 0.3s ease-in-out',
              color: '#fff',
              marginBottom: '10px',
              // position: "relative"
            }}
          >
            <div style={{marginBottom: '6px'}}>
              <strong>Course Name:</strong> {name}
            </div>
            <div style={{marginBottom: '6px'}}>
              <strong>Instructors:</strong> {instructors && instructors.join(", ")}
            </div>
            <div style={{marginBottom: '6px'}}>
              <strong>Location:</strong> {meetBuilding} {meetBldgCode}
            </div>
            <div style={{marginBottom: '6px'}}>
              <strong>CourseID:</strong> {courseId}
            </div>
            <div>
              <strong>Credit Hours:</strong> {credits}
            </div>
          </div>
          {/* Arrow for the popup */}
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[1100%]"
               style={{
                 width: 0,
                 height: 0,
                 borderTop: "10px solid rgba(0, 0, 0, 0.7)",
                 borderLeft: "10px solid transparent",
                 borderRight: "10px solid transparent",
                 position: "absolute",
                 top: "100%",
                 zIndex: 11,
               }}
          ></div>
        </>
      )}
      <strong>{formatCourseCode(code)}</strong> {meetTimeBegin} - {meetTimeEnd} 
      <br /> {meetBuilding} {meetBldgCode} <br /> {instructors && instructors.join(", ")}
    </div>
  );
};

type DayColumnProps = {
  day: string;
  selectedSections: SectionWithCourse[];
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
                    top: card.startCalendar + "px",
                  }}
                >
                  <Card
                    name={card.section.name} // Using the name from Course type
                    code={formatCourseCode(card.section.code)}
                    courseId={card.section.courseId} // Using the courseId from Course type
                    meetTimeBegin={card.meetTime.meetTimeBegin}
                    meetTimeEnd={card.meetTime.meetTimeEnd}
                    meetBuilding={card.meetTime.meetBuilding}
                    meetBldgCode={card.meetTime.meetBldgCode}
                    instructors={card.section.instructors.map(
                      (instr: { name: string }) => capitalizeName(instr.name)
                    )}
                    credits={card.section.credits} 
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
