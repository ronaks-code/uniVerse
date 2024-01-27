import React, { useState, useEffect } from "react";
import { Course, Section, Instructor, SectionWithCourse } from "./CourseTypes";
import { courseUIClasses } from "./CourseUIClasses";
import { PiCaretDownBold, PiCaretUpBold } from "react-icons/pi";

interface CourseDropdownProps {
  course: Course;
  onSectionSelect: (section: SectionWithCourse) => void;
  selectedSectionsNumbers: number[];
  setSelectedSectionsNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  gradientColor?: string;
}

const CourseDropdown: React.FC<CourseDropdownProps> = ({
  course,
  onSectionSelect,
  selectedSectionsNumbers,
  setSelectedSectionsNumbers,
  gradientColor,
}) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const isSectionSelected = (instructorKey: string) => {
    return instructors[instructorKey].some((section) =>
      selectedSectionsNumbers.includes(section.classNumber)
    );
  };

  const backgroundColor = "bg-green-600";

  const { listItem, content, noContent, term, sectionContainer } =
    courseUIClasses;

  // Render section information
  const renderSectionInformation = (section: Section) => {
    return (
      <div className={`${content}`}>
        {/* Meeting Times */}
        <div>
          <strong>Meeting Times:</strong>{" "}
          {section.meetTimes.length > 0 ? (
            section.meetTimes.map((meetingTime) => (
              <div
                key={
                  meetingTime.meetDays +
                  meetingTime.meetTimeBegin +
                  meetingTime.meetTimeEnd
                }
                className={`${content}`}
              >
                {meetingTime.meetDays.join(", ")}: {meetingTime.meetTimeBegin} -{" "}
                {meetingTime.meetTimeEnd}
              </div>
            ))
          ) : (
            <span className={`${noContent}`}>N/A</span>
          )}
        </div>

        {/* Department */}
        {/* <div>
          <strong>Department:</strong>{" "}
          {section.deptName || "N/A"}
        </div> */}

        {/* Render other section details if needed */}
      </div>
    );
  };

  // Function to handle the section selection
  const handleSectionSelect = (section: Section) => {
    const SectionWithCourse: SectionWithCourse = {
      ...section,
      ...course,
    };

    onSectionSelect(SectionWithCourse);
  };

  // Function to toggle the expanded state of terms and professors
  const toggleExpanded = (key: string) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Create an object with instructor name combinations as keys and their sections as values
  const instructors = course.sections.reduce<{ [key: string]: Section[] }>(
    (obj, section) => {
      const instructorKey = section.instructors
        .map((instructor: Instructor) => instructor.name)
        .sort()
        .join("|");
      if (!obj[instructorKey]) {
        obj[instructorKey] = [];
      }
      obj[instructorKey].push(section);
      return obj;
    },
    {}
  );

  // On component mount, initialize all dropdowns as expanded
  useEffect(() => {
    const initialState: { [key: string]: boolean } = {
      [`term|${course.termInd}`]: true,
      ...course.sections.reduce<{ [key: string]: boolean }>((acc, section) => {
        const instructorKey = section.instructors
          .map((instructor: Instructor) => instructor.name)
          .sort()
          .join("|");
        acc[`instructor|${instructorKey}`] = true;
        return acc;
      }, {}),
    };
    setExpanded(initialState);
  }, [course]);

  return (
    <div className={`${sectionContainer}`}>
      <div
        className={`flex cursor-pointer justify-between items-center ${listItem} text-base font-medium text-gray-800 dark:text-gray-200 mb-1 px-2`}
        onClick={() => toggleExpanded(`term|${course.termInd}`)} // Add click handler to toggle term
      >
        <div>
          <strong>Term:</strong>{" "}
          <span className={term}>{course.termInd || "N/A"}</span>
        </div>
        <div>
          <p>Credits:</p>{" "}
          <span className={term}>{course.sections[0].credits || "N/A"}</span>
        </div>
        {expanded[`term|${course.termInd}`] ? (
          <PiCaretUpBold className="mx-1 h-9" />
        ) : (
          <PiCaretDownBold className="mx-1 h-9" />
        )}
      </div>
      {expanded[`term|${course.termInd}`] && ( // Only render if term is expanded
        <ul className={`list-none pl-0`}>
          {Object.keys(instructors).map((instructorKey, index) => (
            <li
              key={index}
              className={`${listItem} border-t border-gray-400 dark:border-gray-700 mr-auto`}
            >
              <div
                className={`flex cursor-pointer justify-between items-center font-bold text-gray-900 dark:text-white px-2 ${
                  isSectionSelected(instructorKey) ? "" : "bg-transparent"
                }`}
                style={{
                  background: isSectionSelected(instructorKey)
                    ? gradientColor
                    : undefined,
                }}
                onClick={() => toggleExpanded(`instructor|${instructorKey}`)}
              >
                <div>{instructorKey.split("|").join(", ")}</div>
                {expanded[`instructor|${instructorKey}`] ? (
                  <PiCaretUpBold className="mx-1 h-9" />
                ) : (
                  <PiCaretDownBold className="mx-1 h-9" />
                )}
              </div>
              {expanded[`instructor|${instructorKey}`] && // Only render if professor is expanded
                instructors[instructorKey].map((section, sectionIndex) => (
                  <div
                    key={sectionIndex}
                    className={`pl-4 cursor-pointer ${
                      selectedSectionsNumbers.includes(section.classNumber)
                        ? ""
                        : "bg-transparent"
                    }`}
                    style={{
                      background: selectedSectionsNumbers.includes(
                        section.classNumber
                      )
                        ? gradientColor
                        : undefined,
                    }}
                    onClick={() => handleSectionSelect(section)}
                  >
                    <div
                      className={`font-bold text-gray-900 dark:text-white px-2 `}
                    >{`${section.number}`}</div>
                    {renderSectionInformation(section)}
                  </div>
                ))}
            </li>
          ))}
          {course.sections.length === 0 && (
            <div
              className={`${listItem} ${content} text-gray-900 dark:text-white`}
            >
              No sections found.
            </div>
          )}
        </ul>
      )}
    </div>
  );
};

export default CourseDropdown;
