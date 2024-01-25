import React from "react";

export type CardProps = {
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
export const formatCourseCode = (code: string) => {
  const match = code.match(/^([a-zA-Z]+)(\d+[a-zA-Z]*)$/);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return code;
};

// Helper function to format the instructor name
export const capitalizeName = (name: string) => {
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

export default Card;
