import React from "react";
import { Course, Section } from "../CourseTypes";
import { courseUIClasses } from "../CourseUIClasses";

type CourseDropdownProps = {
  course: Course;
};

const CourseDropdown: React.FC<CourseDropdownProps> = ({ course }) => {
  const { listItem, content, term } = courseUIClasses;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 space-y-4`}>
      <div className={`${listItem} font-semibold text-gray-800 dark:text-gray-200 mb-1`}>
        <strong>Term:</strong> <span className={term} style={{ marginRight: '4px'}}>{course.termInd}</span>
      </div>
      <ul className="list-none pl-0">
        {course.sections.map((section, index) => (
          <li key={index} className={`${listItem} border-t border-gray-400 dark:border-gray-700`}>
            <div className="font-bold text-gray-900 dark:text-white" style={{ marginBottom: '2px'}}>
              Section {section.number}:
            </div>
            {/* Render additional section information here */}
            {/* <div>
              <strong>Department:</strong> {section.deptName}
            </div> */}
            <div>
              <strong>Instructors:</strong>{" "}
              {section.instructors.map((instructor) => instructor.name).join(", ")}
            </div>
            <div>
              <strong>Meeting Times:</strong>
              {section.meetTimes.map((meetingTime) => (
                <div
                  key={meetingTime.meetDays + meetingTime.meetTimeBegin + meetingTime.meetTimeEnd}
                  className={`${content} text-gray-900 dark:text-white`}
                >
                  {meetingTime.meetDays.join(", ")}: {meetingTime.meetTimeBegin} - {meetingTime.meetTimeEnd}
                </div>
              ))}
            </div>
            <div>
              <strong>Description:</strong>
              <div className={`${content} text-gray-900 dark:text-white`}>
                {course.description.replace("(P)", "").trim()}
              </div>
            </div>
            {/* Render other section details if needed */}
          </li>
        ))}
        {course.sections.length === 0 && (
          <div className={`${listItem} ${content} text-gray-900 dark:text-white`}>
            No sections found.
          </div>
        )}
      </ul>
    </div>
  );
};

export default CourseDropdown;
