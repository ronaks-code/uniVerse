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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(value);
    }, 300); // 300ms delay
  };

  const filteredCourses = useMemo(() => {
    const formattedSearchTerm = debouncedSearchTerm.toUpperCase();
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
        <input
          type="text"
          placeholder="Search by course code..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Suspense fallback={<div>Loading...</div>}>
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course: Course, index: number) => (
              <CourseDropdown key={index} course={course} />
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
