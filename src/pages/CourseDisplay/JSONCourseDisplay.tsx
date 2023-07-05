import React, { useState, useMemo, useRef, Suspense, lazy } from "react";
import jsonData from "../../courses/UF_Jun-30-2023_23_summer_clean.json";
import { Course } from "../../components/CourseUI/CourseTypes";
import SideBar from "../../components/SideBar/Sidebar";
import CourseDropdown from "../../components/CourseUI/CourseDropdown/CourseDropdown";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { JSONCourseDisplayClasses } from "./JSONCourseDisplayClasses"; // Import the styles

const CourseCard = lazy(
  () => import("../../components/CourseUI/CourseCard/CourseCard")
);

type CourseData = Course[];

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

const JSONCourseDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]); // Newly added state for selected courses
  const [displayCourse, setDisplayCourse] = useState<boolean>(false);
  const [openCourseCode, setOpenCourseCode] = useState<string[] | null>();

  const {
    container,
    badge,
    input,
    minusIcon,
    plusIcon,
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

  const toggleCourseDropdown = (courseCode: string) => {
    setOpenCourseCode((prevOpenCourseCodes = []) => {
      if (prevOpenCourseCodes !== null) {
        const isOpen = prevOpenCourseCodes.includes(courseCode);
        if (isOpen) {
          // Course is already open, remove it from the array
          return prevOpenCourseCodes.filter((code) => code !== courseCode);
        } else {
          // Course is closed, add it to the array
          return [...prevOpenCourseCodes, courseCode];
        }
      }
    });
  };

  const toggleCourseSelection = (course: Course) => {
    // Check if the course is already selected
    const index = selectedCourses.findIndex(
      (selectedCourse) =>
        selectedCourse.code === course.code &&
        selectedCourse.name === course.name
    );
    if (index !== -1) {
      // Course isalready selected, remove it from the selectedCourses array
      setSelectedCourses((prevSelectedCourses) => {
        const updatedSelectedCourses = [...prevSelectedCourses];
        updatedSelectedCourses.splice(index, 1);
        return updatedSelectedCourses;
      });
    } else {
      // Course is not selected, add it to the selectedCourses array
      setSelectedCourses((prevSelectedCourses) => [
        ...prevSelectedCourses,
        course,
      ]);
    }
    setDisplayCourse(true); // Trigger animation
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
        <div className="space-x-2 mb-4">
          {selectedCourses.length > 0 &&
            selectedCourses.map((course: Course, index: number) => (
              <span
                key={index}
                className={badge}
              >
                {course.code.replace(/([A-Z]+)/g, "$1 ")}
              </span>
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

              return (
                <React.Fragment key={index}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedCourses.includes(firstCourse) ? (
                        <>
                          <AiOutlineMinus
                            className={`${minusIcon} ${
                              displayCourse ? "opacity-0 transition-opacity duration-300" : ""
                            }`}
                            onClick={() => toggleCourseSelection(firstCourse)}
                          />
                          <AiOutlinePlus
                            className={`${plusIcon} ${
                              displayCourse ? "opacity-100 transition-opacity duration-300" : "opacity-0"
                            }`}
                            onClick={() => toggleCourseSelection(firstCourse)}
                          />
                        </>
                      ) : (
                        <>
                          <AiOutlinePlus
                            className={`${plusIcon} ${
                              displayCourse ? "opacity-0 transition-opacity duration-300" : ""
                            }`}
                            onClick={() => toggleCourseSelection(firstCourse)}
                          />
                          <AiOutlineMinus
                            className={`${minusIcon} ${
                              displayCourse ? "opacity-100 transition-opacity duration-300" : "opacity-0"
                            }`}
                            onClick={() => toggleCourseSelection(firstCourse)}
                          />
                        </>
                      )}
                      <div
                        className={courseCard} // Apply the courseCard class
                        onClick={() =>
                          toggleCourseDropdown(
                            `${firstCourse.code}|${firstCourse.name}`
                          )
                        }
                      >
                        <div>
                          {firstCourse.code.replace(/([A-Z]+)/g, "$1 ")}
                        </div>
                        <div className="text-sm font-normal">
                          {firstCourse.name}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ml-10">
                    {openCourseCode && openCourseCode.includes(`${firstCourse.code}|${firstCourse.name}`) &&
                      courses.map((course, index) => (
                        <CourseDropdown key={index} course={course} />
                      ))}
                  </div>
                </React.Fragment>
              );
            })
          ) : (
            <div>No courses found.</div>
          )}
        </Suspense>
      </div>
    </>
  );
};

export default JSONCourseDisplay;
