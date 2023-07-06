import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  Suspense,
  lazy,
} from "react";
import jsonData from "../../courses/UF_Jun-30-2023_23_summer_clean.json";
import { Course } from "../../components/CourseUI/CourseTypes";
import SideBar from "../../components/SideBar/Sidebar";
import CourseDropdown from "../../components/CourseUI/CourseDropdown/CourseDropdown";
import {
  PiPlusBold,
  PiMinusBold,
  PiCaretDownBold,
  PiCaretUpBold,
  PiHeartBold,
  PiHeartFill,
} from "react-icons/pi";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses"; // Import the styles
import ColorHash from "color-hash"; // Import the color hash function
import { CSSTransition } from "react-transition-group";

const groupByCourseCodeAndName = (courses: Course[]) => {
  return courses.reduce((grouped: { [key: string]: Course[] }, course) => {
    const key = `${course.code}|${course.name}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(course);
    return grouped;
  }, {});
};

const colorHash = new ColorHash({
  saturation: [0.4],
  lightness: [0.4, 0.5, 0.6],
});

const getHashedColor = (course: Course) => {
  return colorHash.hex(course.code + course.name);
};

const JSONCourseDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]); // Newly added state for selected courses
  const [openCourseCode, setOpenCourseCode] = useState<string[] | null>();
  const [lastClick, setLastClick] = useState(0);
  const [likedCourses, setLikedCourses] = useState<Course[]>([]);
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [courseAnimation, setCourseAnimation] = useState<{
    [key: string]: boolean;
  }>({});

  const getCourseBackgroundColor = (course: Course) => {
    const hashedColor = getHashedColor(course);
    return {
      backgroundColor: hashedColor,
    };
  };

  const {
    container,
    badge,
    input,
    minusIcon,
    plusIcon,
    caretDownIcon,
    caretUpIcon,
    heartOutlineIcon,
    heartFillIcon,
    courseCard,
  } = JSONCourseDisplayClasses;

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Convert the input value to uppercase
    value = value.toUpperCase();

    // Extract the prefix
    const prefix = value.match(/[A-Z]+/)?.[0] || "";

    // Remove any spaces from the input
    const inputWithoutSpaces = value.replace(/\s/g, "");

    // Format the input with a space after the prefix if it exists
    let formattedInput = inputWithoutSpaces;
    if (prefix.length > 0 && inputWithoutSpaces.length > prefix.length) {
      formattedInput = prefix + " " + inputWithoutSpaces.slice(prefix.length);
    }

    setSearchTerm(formattedInput);

    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(formattedInput);
    }, 300); // 300ms delay
  };

  const handleCourseCardClick = (event: React.MouseEvent, course: Course) => {
    const isButtonClick =
      (event.target as HTMLElement).closest(".plus-icon") !== null ||
      (event.target as HTMLElement).closest(".minus-icon") !== null ||
      (event.target as HTMLElement).closest(".carets") !== null ||
      (event.target as HTMLElement).closest(".heart-icon") !== null;
  
    const currentTime = new Date().getTime();
  
    if (!isButtonClick) {
      const isSelected = selectedCourses.some(
        (selectedCourse) =>
          selectedCourse.code === course.code &&
          selectedCourse.name === course.name
      );
  
      // If less than 250ms have passed since the last click, treat it as a double click.
      if (currentTime - lastClick < 250) {
        // Clear any existing timeouts
        if (clickTimeout) {
          clearTimeout(clickTimeout);
          setClickTimeout(null);
        }
  
        toggleCourseSelected(course);
      } else {
        // Set up a timeout for the single click action
        setClickTimeout(
          setTimeout(() => {
            toggleCourseDropdown(`${course.code}|${course.name}`);
          }, 250)
        );
      }
  
      // Update last click time
      setLastClick(currentTime);
    }
  };

  const handleBadgeClick = (course: Course) => {
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

  const toggleCourseDropdown = (courseCode: string) => {
    setOpenCourseCode((prevOpenCourseCodes = []) => {
      if (prevOpenCourseCodes === null) {
        // If prevOpenCourseCodes is null, initialize it with the current course code
        return [courseCode];
      } else {
        const isOpen = prevOpenCourseCodes.includes(courseCode);
        // Update the courseAnimation state
        setCourseAnimation((prevCourseAnimation) => ({
          ...prevCourseAnimation,
          [courseCode]: !isOpen,
        }));
        if (!isOpen) {
          // Course is closed, add it to the array
          return [...prevOpenCourseCodes, courseCode];
        } else {
          // Course is already open, remove it from the array
          return prevOpenCourseCodes.filter((code) => code !== courseCode);
        }
      }
    });
  };

  const toggleCourseSelected = (course: Course) => {
    const isSelected = selectedCourses.some(
      (selectedCourse) =>
        selectedCourse.code === course.code &&
        selectedCourse.name === course.name
    );

    if (isSelected) {
      // Remove the course from the list of selected courses if it's already selected.
      setSelectedCourses((prevSelectedCourses) =>
        prevSelectedCourses.filter(
          (selectedCourse) =>
            selectedCourse.code !== course.code ||
            selectedCourse.name !== course.name
        )
      );
    } else {
      // Add the course to the list of selected courses if it's not already selected.
      setSelectedCourses((prevSelectedCourses) => [
        ...prevSelectedCourses,
        course,
      ]);

      // If the course is liked, un-like it.
      if (
        likedCourses.some(
          (likedCourse) =>
            likedCourse.code === course.code && likedCourse.name === course.name
        )
      ) {
        toggleCourseLiked(course);
      }
    }
  };

  const toggleCourseLiked = (course: Course) => {
    const isCourseLiked = likedCourses.some(
      (likedCourse) =>
        likedCourse.code === course.code && likedCourse.name === course.name
    );

    if (isCourseLiked) {
      // Remove the course from the list of liked courses if it's already liked.
      setLikedCourses((prevLikedCourses) =>
        prevLikedCourses.filter(
          (prevLikedCourse) =>
            prevLikedCourse.code !== course.code ||
            prevLikedCourse.name !== course.name
        )
      );
    } else {
      // Add the course to the list of liked courses if it's not already liked.
      setLikedCourses((prevLikedCourses) => [...prevLikedCourses, course]);

      // If the course is selected, unselect it.
      if (
        selectedCourses.some(
          (selectedCourse) =>
            selectedCourse.code === course.code &&
            selectedCourse.name === course.name
        )
      ) {
        toggleCourseSelected(course);
      }
    }
  };

  const filteredCourses = useMemo(() => {
    const formattedSearchTerm = debouncedSearchTerm
      .replace(/\s/g, "")
      .toUpperCase();
    if (formattedSearchTerm.length === 0) {
      return []; // Return an empty array if no search term is provided
    }
    const prefix = formattedSearchTerm.match(/[a-zA-Z]+/)?.[0]?.toUpperCase(); // Extract course prefix
    const additionalCharacters = formattedSearchTerm.slice(prefix?.length); // Extract additional characters
    return (jsonData as Course[])
      .filter((course: Course) => {
        const { code } = course;
        const coursePrefix = code.match(/[a-zA-Z]+/)?.[0]?.toUpperCase(); // Extract course prefix
        return (
          coursePrefix &&
          coursePrefix === prefix &&
          code.toUpperCase().includes(additionalCharacters)
        );
      })
      .sort(
        (a: Course, b: Course) =>
          a.code.localeCompare(b.code) || a.termInd.localeCompare(b.termInd)
      );
  }, [debouncedSearchTerm]);

  const groupedFilteredCourses = useMemo(() => {
    return groupByCourseCodeAndName(filteredCourses);
  }, [filteredCourses]);

  return (
    <>
      <SideBar />
      <div className={container}>
        <div className="space-x-2 mb-4 flex flex-wrap">
          {likedCourses.length > 0 &&
            likedCourses.map((course: Course, index: number) => (
              <div 
                key={index}
                className={`p-4 rounded-md m-2 text-black dark:text-white opacity-60 cursor-pointer sm:w-[18.5rem] w-full h-20 overflow-hidden`} 
                style={getCourseBackgroundColor(course)}
                onClick={() => handleBadgeClick(course)}
              >
                {course.code.replace(/([A-Z]+)/g, "$1 ")}
                <div className="text-xs line-clamp-2 overflow-ellipsis overflow-hidden">{course.name}</div>
              </div>
            ))}
        </div>
        <div className="space-x-2 mb-4 flex flex-wrap">
          {selectedCourses.length > 0 &&
            selectedCourses.map((course: Course, index: number) => (
              <div 
                key={index}
                className={`p-3 rounded-md m-2 text-black dark:text-white cursor-pointer sm:w-[18.5rem] w-full h-20 overflow-hidden`} 
                style={getCourseBackgroundColor(course)}
                onClick={() => handleBadgeClick(course)}
              >
                {course.termInd !== " " && course.termInd !== "C" ? (
                  <strong>
                    {course.code.replace(/([A-Z]+)/g, "$1 ")} - {course.termInd}
                  </strong>
                ) : (
                  <strong>
                    {course.code.replace(/([A-Z]+)/g, "$1 ")}
                  </strong>
                )
                }
                <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">{course.name}</div>
              </div>
            ))}
        </div>
        <input
          type="text"
          placeholder="Search by course code (e.g., XXX 0000)"
          value={searchTerm}
          onChange={handleSearchChange}
          autoCorrect="off"
          className={input}
        />
        <Suspense fallback={<div>Loading...</div>}>
          {Object.keys(groupedFilteredCourses).length > 0 ? (
            Object.keys(groupedFilteredCourses).map((key, index) => {
              const courses = groupedFilteredCourses[key];
              const firstCourse = courses[0];
              const isCourseSelected = selectedCourses.includes(firstCourse);
              const isCourseAnimated =
                courseAnimation[`${firstCourse.code}|${firstCourse.name}`] ||
                false;
              const isOpen = openCourseCode?.includes(
                `${firstCourse.code}|${firstCourse.name}`
              );

              return (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={courseCard}
                        onClick={(e) => handleCourseCardClick(e, firstCourse)}
                      >
                        <div className="flex flex-row items-center justify-evenly w-full h-6 p-1 m-0">
                          {firstCourse.termInd !== " " && firstCourse.termInd !== "C" ? (
                            <>
                              <div className="mr-auto h-6">
                                {firstCourse.code.replace(/([A-Z]+)/g, "$1 ")} - {firstCourse.termInd}
                              </div>
                            </>
                          ) : (
                            <div className="mr-auto h-6">
                              {firstCourse.code.replace(/([A-Z]+)/g, "$1 ")}
                            </div>
                          )}
                          <div className="mx-1 h-9">
                            {isCourseSelected ? (
                              <>
                                <PiMinusBold
                                  className={`${minusIcon} hover:opacity-60`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCourseSelected(firstCourse);
                                  }}
                                />
                              </>
                            ) : (
                              <>
                                <PiPlusBold
                                  className={`${plusIcon} hover:opacity-60`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleCourseSelected(firstCourse);
                                  }}
                                />
                              </>
                            )}
                          </div>
                          <div className="mx-1 h-9">
                            {isOpen ? (
                              <PiCaretUpBold
                                className={`${caretUpIcon} ${
                                  isCourseAnimated
                                    ? "opacity-100 transition-opacity duration-300"
                                    : ""
                                } hover:opacity-60`}
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
                                } hover:opacity-60`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseDropdown(
                                    `${firstCourse.code}|${firstCourse.name}`
                                  );
                                }}
                              />
                            )}
                          </div>
                          <div className="ml-1 mr-[-0.25rem] h-9">
                            {likedCourses.includes(firstCourse) ? (
                              <PiHeartFill
                                className={`${heartFillIcon} hover:opacity-60`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseLiked(firstCourse);
                                }}
                              />
                            ) : (
                              <PiHeartBold
                                className={`${heartOutlineIcon} hover:opacity-60`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleCourseLiked(firstCourse);
                                }}
                              />
                            )}
                          </div>
                        </div>
                        <div className="text-sm font-normal mx-1 line-clamp-1 overflow-ellipsis overflow-hidden">
                          {firstCourse.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  {isOpen && (
                    <div className="ml-4 opacity-100 visible transition-opacity">
                      {courses.map((course, index) => (
                        <CourseDropdown key={index} course={course} />
                      ))}
                    </div>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <div className="dark:text-gray-300">No courses found.</div>
          )}
        </Suspense>
      </div>
    </>
  );
};

export default JSONCourseDisplay;
