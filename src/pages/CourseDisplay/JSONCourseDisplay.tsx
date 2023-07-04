import React, { useState, useMemo, useRef, Suspense, lazy } from "react";
import jsonData from "../../courses/UF_Jun-30-2023_23_summer_clean.json";
import { Course } from "../../components/CourseUI/CourseTypes";
import SideBar from "../../components/SideBar/Sidebar";
import CourseDropdown from "../../components/CourseUI/CourseDropdown/CourseDropdown";

const CourseCard = lazy(
  () => import("../../components/CourseUI/CourseCard/CourseCard")
);

type CourseData = {
  COURSES: Course[];
};

const JSONCourseDisplay: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]); // Newly added state for selected courses

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

  const toggleCourseSelection = (course: Course) => {
    // Check if the course is already selected
    const index = selectedCourses.findIndex(
      (selectedCourse) => selectedCourse.code === course.code
    );
    if (index !== -1) {
      // Course is already selected, remove it from the selectedCourses array
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
    return (jsonData as Course[]).filter((course: Course) => {
      const { code } = course;
      const coursePrefix = code.match(/[a-zA-Z]+/)?.[0]?.toUpperCase(); // Extract course prefix
      return (
        coursePrefix &&
        coursePrefix === prefix &&
        code.toUpperCase().includes(additionalCharacters)
      );
    });
  }, [debouncedSearchTerm]);

  return (
    <>
      <SideBar />
      <div className="flex flex-col items-start content-start h-[100vh] ml-[4.75rem] p-4">
        <div className="space-x-2 mb-4">
          {selectedCourses.length > 0 &&
            selectedCourses.map((course: Course, index: number) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full"
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
        />

        <Suspense fallback={<div>Loading...</div>}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: Course, index: number) => (
              <div key={index}>
                <div
                  className="cursor-pointer text-blue-500"
                  onClick={() => toggleCourseSelection(course)}
                >
                  {course.code.replace(/([A-Z]+)/g, "$1 ")}
                </div>
                {selectedCourses.includes(course) && (
                  <CourseDropdown course={course} />
                )}
              </div>
            ))
          ) : (
            <div>No courses found.</div>
          )}
        </Suspense>
      </div>
    </>
  );
};

export default JSONCourseDisplay;
