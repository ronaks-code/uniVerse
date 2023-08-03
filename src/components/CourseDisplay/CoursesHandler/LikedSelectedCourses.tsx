import React, { useState, useRef } from "react";
import { Course, SectionWithCourseCode } from "../CourseUI/CourseTypes";
import ColorHash from "color-hash";
import chroma from "chroma-js";
import CourseDropdown from "../CourseUI/CourseDropdown";
import { PiCaretDownBold, PiCaretUpBold, PiTrashBold } from "react-icons/pi";

interface LikedSelectedCoursesProps {
  likedCourses: Course[];
  setLikedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedSections?: SectionWithCourseCode[];
  setSelectedSections?: React.Dispatch<
    React.SetStateAction<SectionWithCourseCode[]>
  >;
}

const colorHash = new ColorHash({
  saturation: [0.8, 0.6],
  lightness: [0.6],
});

// Create a Map to store the number of colors for each course
const courseColorCounts = new Map<string, number>();

const getGradientColors = (course: Course) => {
  const courseKey = course.code + course.name;
  let colorCount: number;

  if (courseColorCounts.has(courseKey)) {
    colorCount = courseColorCounts.get(courseKey) as number;
  } else {
    // Randomly choose to use 2 or 3 colors and save the count
    // ! Uncomment line below if you want to use 2 or 3 colors
    // colorCount = Math.random() < 0.5 ? 2 : 3;
    colorCount = 2;
    courseColorCounts.set(courseKey, colorCount);
  }

  const baseColorHex = colorHash.hex(courseKey);
  const baseColorHsl = chroma(baseColorHex).hsl() as [number, number, number];

  if (colorCount === 2) {
    // Complementary colors are 180 degrees apart on the color wheel
    const complementaryColorHsl: [number, number, number] = [
      (baseColorHsl[0] + 180) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];
    const complementaryColorHex = chroma.hsl(...complementaryColorHsl).hex();

    return `
      linear-gradient(135deg, ${baseColorHex} 0%, ${complementaryColorHex} 100%)
    `;
  } else {
    // Triadic colors are 120 degrees apart on the color wheel
    const triadicColor1Hsl: [number, number, number] = [
      (baseColorHsl[0] + 120) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];
    const triadicColor2Hsl: [number, number, number] = [
      (baseColorHsl[0] + 240) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];

    const triadicColor1Hex = chroma.hsl(...triadicColor1Hsl).hex();
    const triadicColor2Hex = chroma.hsl(...triadicColor2Hsl).hex();

    return `
      linear-gradient(135deg, ${baseColorHex} 0%, ${triadicColor1Hex} 50%, ${triadicColor2Hex} 100%)
    `;
  }
};

const LikedSelectedCourses: React.FC<LikedSelectedCoursesProps> = ({
  likedCourses,
  setLikedCourses,
  selectedCourses,
  setSelectedCourses,
  selectedSections = [],
  setSelectedSections = () => {},
}) => {
  const [localSelectedSections, setLocalSelectedSections] = useState<
    SectionWithCourseCode[]
  >(selectedSections || []);
  const [localSetSelectedSections, setLocalSetSelectedSections] = useState<
    React.Dispatch<React.SetStateAction<SectionWithCourseCode[]>>
  >(setSelectedSections || (() => {}));

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
              <div key={index} className="relative">
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white max-w-[calc(100vw)] lg-xl:w-[320px] cursor-pointer h-20 overflow-hidden backdrop-filter backdrop-blur-md`}
                  style={{
                    backgroundImage: getGradientColors(course),
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
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
                      className="mx-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={16} />
                      ) : (
                        <PiCaretDownBold size={16} />
                      )}
                    </div>
                    <button
                      className="ml-1 h-0"
                      onClick={(event) => handleBadgeClick(course, event)}
                    >
                      <PiTrashBold size={16} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div
                    className="max-w-[calc(100vw-2.5rem)] lg-xl:w-[320px] pl-4"
                    ref={dropdownRef}
                  >
                    <CourseDropdown
                      course={course}
                      selectedSections={localSelectedSections}
                      setSelectedSections={localSetSelectedSections}
                    />
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
              <div key={index} className="relative select-none">
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white max-w-[calc(100vw)] lg-xl:w-[320px] cursor-pointer h-20 overflow-hidden backdrop-filter backdrop-blur-md`}
                  style={{
                    backgroundImage: getGradientColors(course),
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
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
                      className="mx-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={16} />
                      ) : (
                        <PiCaretDownBold size={16} />
                      )}
                    </div>
                    <button
                      className="ml-1 h-0"
                      onClick={(event) => handleBadgeClick(course, event)}
                    >
                      <PiTrashBold size={16} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div
                    className="max-w-[calc(100vw-2.5rem)] lg-xl:w-[320px] pl-4"
                    ref={dropdownRef}
                  >
                    <CourseDropdown
                      course={course}
                      selectedSections={localSelectedSections}
                      setSelectedSections={localSetSelectedSections}
                    />
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
