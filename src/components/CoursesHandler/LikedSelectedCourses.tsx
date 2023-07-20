import React, { useState, useRef } from "react";
import { Course } from "../CourseUI/CourseTypes";
import ColorHash from "color-hash";
import CourseDropdown from "../CourseUI/CourseDropdown/CourseDropdown";
import { PiCaretDownBold, PiCaretUpBold, PiTrashBold } from "react-icons/pi";
import { ShowFilteredCoursesClasses } from "./ShowFilteredCourses/ShowFilteredCoursesClasses";

interface LikedSelectedCoursesProps {
  likedCourses: Course[];
  setLikedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
}

const colorHash = new ColorHash({
  saturation: [0.4],
  lightness: [0.3, 0.4, 0.5],
});

const getHashedColor = (course: Course) => {
  let color = colorHash.hex(course.code + course.name);
  return `linear-gradient(rgba(128, 0, 128, 0.5), ${color})`;
};

const LikedSelectedCourses: React.FC<LikedSelectedCoursesProps> = ({
  likedCourses,
  setLikedCourses,
  selectedCourses,
  setSelectedCourses,
}) => {
  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleBadgeClick = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter(
        (selectedCourse) =>
          selectedCourse.code !== course.code ||
          selectedCourse.name !== course.name
      )
    );

    setLikedCourses((prevLikedCourses) =>
      prevLikedCourses.filter(
        (likedCourse) =>
          likedCourse.code !== course.code || likedCourse.name !== course.name
      )
    );
  };

  const handleCardClick = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveCourses((prevActiveCourses) =>
      prevActiveCourses.includes(course)
        ? prevActiveCourses.filter(
            (activeCourse) =>
              activeCourse.code !== course.code ||
              activeCourse.name !== course.name
          )
        : [...prevActiveCourses, course]
    );
  };

  const isCourseActive = (course: Course) => activeCourses.includes(course);

  return (
    <>
      {likedCourses.length > 0 && (
        <>
          <div className="flex mb-4 select-none">
            <div className="text-purple-500 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Liked Courses
            </div>
          </div>
          <div className="mb-4 pl-2 select-none">
            {likedCourses.map((course: Course, index: number) => (
              <div
                key={index}
                className="relative"
              >
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white w-[320px] cursor-pointer h-20 overflow-hidden bg-black bg-opacity-50 backdrop-filter backdrop-blur-md`}
                  style={{ backgroundImage: getHashedColor(course) }}
                  onClick={(event) => handleCardClick(course, event)}
                >
                  <div className="flex flex-row">
                    <div className="mr-auto">
                      {course.termInd !== " " && course.termInd !== "C" ? (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")} -{" "}
                          {course.termInd}
                        </strong>
                      ) : (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")}
                        </strong>
                      )}
                    </div>
                    <div
                      className="ml-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={20} />
                      ) : (
                        <PiCaretDownBold size={20} />
                      )}
                    </div>
                    <button
                      className="mx-1 h-0"
                      onClick={(event) => handleBadgeClick(course, event)}
                    >
                      <PiTrashBold size={20} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div className="w-[320px] pl-4" ref={dropdownRef}>
                    <CourseDropdown course={course} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {selectedCourses.length > 0 && (
        <>
          <div className="flex mb-4 select-none">
            <div className="text-purple-700 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Selected Courses
            </div>
          </div>
          <div className="mb-4 pl-2">
            {selectedCourses.map((course: Course, index: number) => (
              <div
                key={index}
                className="relative select-none"
              >
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white w-[320px] cursor-pointer h-20 overflow-hidden bg-black bg-opacity-50 backdrop-filter backdrop-blur-md`}
                  style={{ backgroundImage: getHashedColor(course) }}
                  onClick={(event) => handleCardClick(course, event)}
                >
                  <div className="flex flex-row">
                    <div className="mr-auto">
                      {course.termInd !== " " && course.termInd !== "C" ? (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")} -{" "}
                          {course.termInd}
                        </strong>
                      ) : (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")}
                        </strong>
                      )}
                    </div>
                    <div
                      className="ml-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={20} />
                      ) : (
                        <PiCaretDownBold size={20} />
                      )}
                    </div>
                    <button
                      className="mx-1 h-0"
                      onClick={(event) => handleBadgeClick(course, event)}
                    >
                      <PiTrashBold size={20} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div className="w-[320px] pl-4" ref={dropdownRef}>
                    <CourseDropdown course={course} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default LikedSelectedCourses;
