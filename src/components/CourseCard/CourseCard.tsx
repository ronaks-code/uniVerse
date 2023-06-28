import React, { useState, useEffect } from "react";
import { Course } from "./CourseTypes";

export type CourseCardProps = {
  course: Course;
};

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [termExists, setTermExists] = useState(false);
  const [meetTimeExists, setMeetTimeExists] = useState(false);
  const [finalExamExists, setFinalExamExists] = useState(false);

  useEffect(() => {
    const doesTermExist = course.termInd !== " ";
    setTermExists(doesTermExist);

    const doesMeetTimeExist = course.sections.some(
      (section) => section.meetTimes && section.meetTimes.length > 0
    );
    setMeetTimeExists(doesMeetTimeExist);

    const doesFinalExamExist = course.sections.some(
      (section) => section.finalExam && section.finalExam.length > 0
    );
    setFinalExamExists(doesFinalExamExist);
  }, [course]);

  return (
    <div style={{ border: "1px solid #ccc", padding: "10px", margin: "10px" }}>
      <h3>
        {course.code} - {course.name}
      </h3>
      {termExists && (
        <p>
          <strong>Term:</strong> {course.termInd}
        </p>
      )}
      <p>
        <strong>Description:</strong> {course.description}
      </p>
      <p>
        <strong>Prerequisites:</strong> {course.prerequisites}
      </p>
      <strong>Sections:</strong>
      <ul>
        {course.sections.map((section, index) => (
          <li key={index}>
            <p className="ml-8">
              <strong>Section {section.number}:</strong> {section.display} (
              {section.credits} credits)
              <br />
              <p className="ml-4">
                <strong>Department:</strong> {section.deptName}
                <br />
                <strong>Instructors:</strong>{" "}
                {section.instructors
                  .map((instructor) => instructor.name)
                  .join(", ")}
                <br />
                <strong>Meeting Times:</strong>
                {meetTimeExists ? "" : " N/A"}
                <ul>
                  {meetTimeExists &&
                    section.meetTimes.map((meetTime, index) => (
                      <li key={index}>
                        Days: {meetTime.meetDays.join(", ")}
                        <br />
                        Time: {meetTime.meetTimeBegin} - {meetTime.meetTimeEnd}
                        <br />
                        Building: {meetTime.meetBuilding}
                        <br />
                        Room: {meetTime.meetRoom}
                      </li>
                    ))}
                </ul>
                <strong>Final Exam:</strong>{" "}
                {finalExamExists ? section.finalExam : "N/A"}
              </p>
            </p>
            <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseCard;