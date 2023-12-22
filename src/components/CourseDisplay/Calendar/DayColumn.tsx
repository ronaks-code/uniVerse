import React from "react";
import { CalendarStyles } from "./CalendarUIClasses";
import { SectionWithCourse, Course } from "../CourseUI/CourseTypes";

// Import Firebase services
import { getFirestore, collection, getDocs } from "firebase/firestore";

// Import the JSON data
import jsonData from "../../../courses/UF_Jun-30-2023_23_summer_clean.json";

// import global state and custom hook
import { useStateValue } from "../../../context/globalState";
import useLocalStorage from "../../../hooks/useLocalStorage";

const firestore = getFirestore();

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
        whiteSpace: "normal",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineClamp: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        ...style,
      }}
    >
      {hovered && (
        <>
          <div
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-[110%] z-10"
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              border: "1px solid #333",
              borderRadius: "5px",
              padding: "10px",
              width: "280px",
              transition: "all 0.3s ease-in-out",
              color: "#fff",
              marginBottom: "10px",
              // position: "relative"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <strong>Course Name</strong>{" "}
              <span
                style={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <strong>Instructors</strong>{" "}
              <span
                style={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {instructors && instructors.join(", ")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <strong>Location</strong>{" "}
              <span
                style={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {meetBuilding} {meetBldgCode}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "6px",
                alignItems: "center",
              }}
            >
              <strong>CourseID</strong>{" "}
              <span
                style={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {courseId}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong>Credit Hours</strong>{" "}
              <span
                style={{
                  maxWidth: "60%",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {credits}
              </span>
            </div>
          </div>
          {/* Arrow for the popup */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-[2350%]"
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
      <br /> {meetBuilding} {meetBldgCode} <br />{" "}
      {instructors && instructors.join(", ")}
    </div>
  );
};

const getAllCourses = async (): Promise<Course[]> => {
  try {
    const coursesCollection = collection(firestore, "courses");
    const courseSnapshot = await getDocs(coursesCollection);
    const courses = courseSnapshot.docs.map((doc) => doc.data()) as Course[];
    return courses;
  } catch (error) {
    console.error("Error fetching courses from Firebase:", error);
    // If there's an error (maybe due to network issues), return the local JSON data
    return jsonData as Course[];
  }
};

const findSectionByClassNumber = async (
  classNumber: number
): Promise<SectionWithCourse | undefined> => {
  const courses = await getAllCourses();
  for (let course of courses) {
    for (let section of course.sections) {
      if (section.classNumber === classNumber) {
        // Combine the course and section into a SectionWithCourse object
        return { ...section, ...course };
      }
    }
  }
  return undefined;
};

type DayColumnProps = {
  day: string;
  selectedSections: number[];
  timeSlots: string[];
};

class DayColumn extends React.Component<DayColumnProps> {
  calendarRef = React.createRef<HTMLDivElement>();
  state: {
    calendarHeight: number | null;
    selectedSectionDetails: (SectionWithCourse | undefined)[];
  } = {
    calendarHeight: null,
    selectedSectionDetails: [],
  };

  async componentDidMount() {
    if (this.calendarRef.current) {
      this.setState({
        calendarHeight: this.calendarRef.current.getBoundingClientRect().height,
      });
    }

    // Fetch all relevant sections based on selectedSections
    const selectedSectionDetails = await Promise.all(
      this.props.selectedSections.map((classNumber) =>
        findSectionByClassNumber(classNumber)
      )
    );
    this.setState({ selectedSectionDetails });
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
    const daySections = this.state.selectedSectionDetails.filter(
      (sectionDetail) => {
        // Ensure sectionDetail is not undefined before proceeding
        if (!sectionDetail) return false;

        return sectionDetail.meetTimes.some((meetingTime) =>
          meetingTime.meetDays.includes(this.props.day)
        );
      }
    );

    // This is the window height + 16px * 80 (80rem)
    const calendarHeight = 1280;
    const totalSlots = this.props.timeSlots.length;
    // console.log("totalSlots:", totalSlots);

    const sectionCards = daySections
      .flatMap((section, index) => {
        if (!section) return [];

        return section.meetTimes.map((meetTime, meetIndex) => {
          if (!meetTime.meetDays.includes(this.props.day)) {
            return null;
          }

          const startFraction = this.timeStringToDayFraction(
            meetTime.meetTimeBegin
          );
          const endFraction = this.timeStringToDayFraction(
            meetTime.meetTimeEnd
          );

          const startCalendar = startFraction * calendarHeight;
          const endCalendar = endFraction * calendarHeight;

          const heightOfCard = endCalendar - startCalendar;

          return {
            key: `${index}-${meetIndex}`,
            section,
            meetTime,
            startCalendar,
            endCalendar,
            heightOfCard,
          };
        });
      })
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
