import React, { useState } from "react";
import { Course, Section } from "../CourseTypes";
import { courseUIClasses } from "../CourseUIClasses";

type CourseDropdownProps = {
  course: Course;
};

const CourseDropdown: React.FC<CourseDropdownProps> = ({ course }) => {
  const { list, listItem, hoverableList } = courseUIClasses;

  return (
    <div className={`${hoverableList} p-4`}>
      {
        <ul className={list}>
          {course.sections.map((section, index) => (
            <li key={index} className={`${listItem} w-screen sm:w-[400px]`}>
              <div>
                <strong>Section {section.number}:</strong>
              </div>
              {/* Render additional section information here */}
              <div>
                <strong>Department:</strong> {section.deptName}
              </div>
              <div>
                <strong>Instructors:</strong>{" "}
                {section.instructors
                  .map((instructor) => instructor.name)
                  .join(", ")}
              </div>
              <div>
                <strong>Meeting Times:</strong>
                {section.meetTimes.map((meetingTime) => (
                  <div key={meetingTime.meetDays + meetingTime.meetTimeBegin + meetingTime.meetTimeEnd}>
                    {meetingTime.meetDays.join(", ")}: {meetingTime.meetTimeBegin} - {meetingTime.meetTimeEnd}
                  </div>
                ))}
              </div>
              {/* Render other section details if needed */}
            </li>
          ))}
          {course.sections.length === 0 && <div>No sections found.</div>}
        </ul>
      }
    </div>
  );
};

export default CourseDropdown;
