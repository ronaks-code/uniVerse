import React, { useState, useRef } from "react";
import { Course } from "../CourseUI/CourseTypes";
import ColorHash from "color-hash";
import CourseDropdown from "../CourseUI/CourseDropdown/CourseDropdown";
import { PiTrashBold } from "react-icons/pi";

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
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
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
    setActiveCourse((prevActiveCourse) =>
      prevActiveCourse === course ? null : course
    );

    if (dropdownRef.current) {
      const cardRect = event.currentTarget.getBoundingClientRect();
      dropdownRef.current.style.left = `${cardRect.left}px`;
      dropdownRef.current.style.top = `${cardRect.bottom}px`;
    }
  };

  const closeDropdown = () => {
    setActiveCourse(null);
  };

  return (
    <>
      {likedCourses.length > 0 && (
        <>
          <div className="flex mb-4">
            <div className="text-purple-500 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Liked Courses
            </div>
          </div>
          <div className="space-x-2 mb-4 flex flex-wrap">
            {likedCourses.map((course: Course, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-md m-2 text-black dark:text-white opacity-75 cursor-pointer sm:w-[18.5rem] w-full h-20 overflow-hidden bg-black bg-opacity-50 backdrop-filter backdrop-blur-md relative`}
                style={{ backgroundImage: getHashedColor(course) }}
                onClick={(event) => handleCardClick(course, event)}
              >
                <button
                  className="absolute top-0 right-0 p-1"
                  onClick={(event) => handleBadgeClick(course, event)}
                >
                  <PiTrashBold size={20} />
                </button>
                {course.code.replace(/([A-Z]+)/g, "$1 ")}
                <div className="text-xs line-clamp-2 overflow-ellipsis overflow-hidden">
                  {course.name}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {selectedCourses.length > 0 && (
        <>
          <div className="flex mb-4">
            <div className="text-purple-700 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Selected Courses
            </div>
          </div>
          <div className="space-x-2 mb-4 flex flex-wrap">
            {selectedCourses.map((course: Course, index: number) => (
              <div
                key={index}
                className="relative p-4 rounded-md m-2 text-black dark:text-white opacity-75 cursor-pointer sm:w-[18.5rem] w-full h-20 overflow-hidden bg-black bg-opacity-50 backdrop-filter backdrop-blur-md"
                style={{ backgroundImage: getHashedColor(course) }}
                onClick={(event) => handleCardClick(course, event)}
              >
                <button
                  className="absolute top-0 right-0 p-1"
                  onClick={(event) => handleBadgeClick(course, event)}
                >
                  <PiTrashBold size={20} />
                </button>
                {course.termInd !== " " && course.termInd !== "C" ? (
                  <strong>
                    {course.code.replace(/([A-Z]+)/g, "$1 ")} - {course.termInd}
                  </strong>
                ) : (
                  <strong>{course.code.replace(/([A-Z]+)/g, "$1 ")}</strong>
                )}
                <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                  {course.name}
                </div>
              </div>
            ))}
            {activeCourse && (
              <div
                className="z-10 top-full w-[320px] absolute left-0"
                ref={dropdownRef}
                onClick={closeDropdown}
              >
                <CourseDropdown course={activeCourse} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default LikedSelectedCourses;
