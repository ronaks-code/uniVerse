import React, { useState, useMemo, useRef, Suspense, lazy } from "react";
import jsonData from "../../courses/UF_Jun-30-2023_23_summer_clean.json";
import { Course } from "../../components/CourseCard/CourseTypes";
import SideBar from "../../components/SideBar/Sidebar";

const CourseCard = lazy(() => import("../../components/CourseCard/CourseCard"));

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
    return (jsonData as Course[]).filter((course: Course) => {
      const { code } = course;
      return code.toUpperCase().includes(formattedSearchTerm);
    });
  }, [debouncedSearchTerm, courses]);

  

  return (
    <>
      <SideBar />
      <div className='flex flex-col items-start content-start h-[100vh] ml-[4.75rem] p-4'>
        <input
          type="text"
          placeholder="Search by course code..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <Suspense fallback={<div>Loading...</div>}>
          {filteredCourses.map((course: Course, index: number) => (
            <CourseCard key={index} course={course} />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default JSONCourseDisplay;
