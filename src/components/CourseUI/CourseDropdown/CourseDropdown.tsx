import React, { useState } from "react";
import { Course, Section } from "../CourseTypes";
import { courseUIClasses } from "../CourseUIClasses";

type CourseDropdownProps = {
  course: Course;
};

const CourseDropdown: React.FC<CourseDropdownProps> = ({ course }) => {
  const [showSections, setShowSections] = useState(false);

  const toggleSections = () => {
    setShowSections((prevState) => !prevState);
  };

  const { list, listItem, hoverableList } = courseUIClasses;

  return (
    <div className={`${hoverableList} mt-4 p-4`}>
      <div className="cursor-pointer">
        <div
          className="text-blue-500 hover:underline"
          onClick={toggleSections}
        >
          <strong className="mr-1">{course.code.replace(/([A-Z]+)/g, "$1 ")}</strong>
        </div>
      </div>
      {showSections && (
        <ul className={list}>
          {course.sections.map((section, index) => (
            <li key={index} className={`${listItem} w-screen sm:w-[800px]`}>
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
              {/* Render other section details if needed */}
            </li>
          ))}
          {course.sections.length === 0 && <div>No sections found.</div>}
        </ul>
      )}
    </div>
  );
};

export default CourseDropdown;
