import React, { useState, useMemo, useEffect, useRef, Suspense } from "react";
import jsonData from "../../../courses/UF_Jun-30-2023_23_summer_clean.json";
import { Course, SectionWithCourse } from "../CourseUI/CourseTypes";
import CourseDropdown from "../CourseUI/CourseDropdown";
import {
  PiPlusBold,
  PiMinusBold,
  PiCaretDownBold,
  PiCaretUpBold,
  PiHeartBold,
  PiHeartFill,
  PiEye,
} from "react-icons/pi";
import { ShowFilteredCoursesClasses } from "./ShowFilteredCoursesClasses";

// Import global state and custom hook
import { useStateValue } from "../../../context/globalState";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface ShowFilteredCoursesProps {
  debouncedSearchTerm: string;
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  likedCourses: Course[];
  setLikedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  onSectionSelect: (section: SectionWithCourse) => void;
}

type CourseState = {
  [key: string]: boolean;
};

const ShowFilteredCourses: React.FC<ShowFilteredCoursesProps> = ({
  debouncedSearchTerm,
  selectedCourses,
  setSelectedCourses,
  likedCourses,
  setLikedCourses,
  onSectionSelect,
}) => {
  const [expandedCourses, setExpandedCourses] = useState<{
    [key: string]: boolean;
  }>({});
  const [openCourses, setOpenCourses] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
    
  const doubleClickRef = useRef(false);
  const lastClickRef = useRef(0);
  const courseAnimation = useRef<{ [key: string]: boolean }>({});

  const {
    minusIcon,
    plusIcon,
    caretDownIcon,
    caretUpIcon,
    heartOutlineIcon,
    heartFillIcon,
    eyeIcon,
    courseCard,
  } = ShowFilteredCoursesClasses;

  // Toggle course description visibility
  const toggleCourseDescription = (courseCode: string) => {
    setIsDescriptionOpen((prevStatus) => ({
      ...prevStatus,
      [courseCode]: !prevStatus[courseCode],
    }));
  };

  // Handle the click on the course card
  const handleCourseCardClick = (event: React.MouseEvent, course: Course) => {
    const currentTime = new Date().getTime();
    const key = `${course.code}|${course.name}`;

    const isDoubleClicked = currentTime - lastClickRef.current < 250;
    lastClickRef.current = currentTime;

    if (isDoubleClicked) {
      doubleClickRef.current = true;
      toggleCourseSelected(course);
    } else {
      setTimeout(() => {
        if (!doubleClickRef.current) {
          toggleCourseDropdown(key);
        }
        doubleClickRef.current = false;
      }, 250);
    }
  };

  // Function to toggle the dropdown for a course
  const toggleCourseDropdown = (courseCode: string) => {
    courseAnimation.current = {
      ...courseAnimation.current,
      [courseCode]: true,
    };

    setOpenCourses((prevCourses) => ({
      ...prevCourses,
      [courseCode]: !prevCourses[courseCode],
    }));

    setTimeout(() => {
      courseAnimation.current = {
        ...courseAnimation.current,
        [courseCode]: false,
      };
    }, 300);
  };

  // Function to select or deselect a course
  const toggleCourseSelected = (course: Course) => {
    const isSelected = selectedCourses.includes(course);

    if (isSelected) {
      setSelectedCourses((prev) => prev.filter((c) => c !== course));
    } else {
      setSelectedCourses((prev) => [...prev, course]);
    }

    if (likedCourses.includes(course)) {
      toggleCourseLiked(course);
    }
  };

  // Function to like or unlike a course
  const toggleCourseLiked = (course: Course) => {
    const isLiked = likedCourses.includes(course);

    if (isLiked) {
      setLikedCourses((prev) => prev.filter((c) => c !== course));
    } else {
      setLikedCourses((prev) => [...prev, course]);
    }

    if (selectedCourses.includes(course)) {
      toggleCourseSelected(course);
    }
  };

  // Filter the courses based on the debounced search term
  const filteredCourses = useMemo(() => {
    const searchTerm = debouncedSearchTerm.replace(/\s/g, "").toUpperCase();

    if (!searchTerm) {
      return [];
    }

    const coursePrefix = searchTerm.match(/[A-Z]+/)?.[0];
    const additionalChars = searchTerm.slice(coursePrefix?.length || 0);

    return (jsonData as Course[])
      .filter((course) => {
        const code = course.code.toUpperCase();
        return (
          code.startsWith(coursePrefix || "") && code.includes(additionalChars)
        );
      })
      .sort(
        (a, b) =>
          a.code.localeCompare(b.code) || a.termInd.localeCompare(b.termInd)
      );
  }, [debouncedSearchTerm]);

  // Group the filtered courses by code and name
  const groupedFilteredCourses = useMemo(() => {
    return filteredCourses.reduce<{ [key: string]: Course[] }>(
      (acc, course) => {
        const key = `${course.code}|${course.name}`;
        acc[key] = acc[key] || [];
        acc[key].push(course);
        return acc;
      },
      {}
    );
  }, [filteredCourses]);

  return (
    <div className={`pl-4`}>
      <Suspense fallback={<div>Loading...</div>}>
        {Object.keys(groupedFilteredCourses).length > 0 ? (
          <div className="mb-[-2rem]">
            {Object.keys(groupedFilteredCourses).map((key, index) => {
              const courses = groupedFilteredCourses[key];
              const firstCourse = courses[0];
              const isCourseSelected = selectedCourses.includes(firstCourse);
              const isCourseAnimated =
                courseAnimation.current[
                  `${firstCourse.code}|${firstCourse.name}`
                ] || false;
              const isOpen =
                openCourses[`${firstCourse.code}|${firstCourse.name}`];
              const isDescriptionVisible = isDescriptionOpen[firstCourse.code];

              return (
                <React.Fragment key={index}>
                  <div className="items-center justify-between mr-2">
                    <div className="flex items-center">
                      <div
                        className={courseCard}
                        onClick={(e) => handleCourseCardClick(e, firstCourse)}
                      >
                        {/* Course code and term indicator */}
                        <div className="flex flex-row mr-auto text-black dark:text-white items-center justify-evenly w-screen max-w-[calc(100vw-4.5rem)] lg-xl:w-full h-6 p-1 m-0">
                          {firstCourse.termInd !== " " &&
                          firstCourse.termInd !== "C" ? (
                            <div className="mr-auto h-6 font-bold">
                              {firstCourse.code.replace(/([A-Z]+)/g, "$1 ")} -{" "}
                              {firstCourse.termInd}
                            </div>
                          ) : (
                            <div className="mr-auto h-6 font-bold">
                              {firstCourse.code.replace(/([A-Z]+)/g, "$1 ")}
                            </div>
                          )}

                          {/* View description */}
                          <div className="ml-1 h-9">
                            <PiEye
                              className={`${eyeIcon}`} // Add styling for your eye icon
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCourseDescription(firstCourse.code);
                              }}
                            />
                          </div>

                          {/* Selection toggle */}
                          <div className="mx-1 h-9">
                            {isCourseSelected ? (
                              <PiMinusBold
                                className={`${minusIcon}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseSelected(firstCourse);
                                }}
                              />
                            ) : (
                              <PiPlusBold
                                className={`${plusIcon}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseSelected(firstCourse);
                                }}
                              />
                            )}
                          </div>

                          {/* Dropdown toggle */}
                          <div className="mx-1 h-9">
                            {isOpen ? (
                              <PiCaretUpBold
                                className={`${caretUpIcon} ${
                                  isCourseAnimated
                                    ? "opacity-100 transition-opacity duration-300"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseDropdown(
                                    `${firstCourse.code}|${firstCourse.name}`
                                  );
                                }}
                              />
                            ) : (
                              <PiCaretDownBold
                                className={`${caretDownIcon} ${
                                  isCourseAnimated
                                    ? "opacity-100 transition-opacity duration-100"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseDropdown(
                                    `${firstCourse.code}|${firstCourse.name}`
                                  );
                                }}
                              />
                            )}
                          </div>

                          {/* Like toggle */}
                          <div className="ml-1 mr-[-0.25rem] h-9">
                            {likedCourses.includes(firstCourse) ? (
                              <PiHeartFill
                                className={`${heartFillIcon}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseLiked(firstCourse);
                                }}
                              />
                            ) : (
                              <PiHeartBold
                                className={`${heartOutlineIcon}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseLiked(firstCourse);
                                }}
                              />
                            )}
                          </div>
                        </div>

                        {/* Course name */}
                        <div className="text-sm font-normal text-black dark:text-white mx-1 line-clamp-1 overflow-ellipsis overflow-hidden">
                          {firstCourse.name}
                        </div>
                      </div>
                    </div>
                  </div>

                  {isDescriptionVisible && isDescriptionOpen && (
                    <div className="px-4 py-2 mb-2 bg-white dark:bg-gray-800 rounded-md shadow-md overflow-auto z-10 w-screen max-w-[calc(100vw-2.5rem)] lg-xl:w-[320px]">
                      <div className="modal-content">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <strong>Description:</strong>
                          <div
                            className={`ml-4 my-2 text-sm text-gray-700 dark:text-gray-300`}
                          >
                            {firstCourse.description
                              ? firstCourse.description
                                  .replace("(P)", "")
                                  .trim()
                              : "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {isOpen && (
                    <div className="ml-0 opacity-100 visible transition-opacity max-w-[calc(100vw-3rem)] lg-xl:w-[320px]">
                      {courses.map((course, index) => (
                        <CourseDropdown
                          key={index}
                          course={course}
                          onSectionSelect={onSectionSelect}
                        />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        ) : (
          <div className="px-4 -mb-4 dark:text-gray-300">No courses found.</div>
        )}
      </Suspense>
    </div>
  );
};

export default ShowFilteredCourses;
