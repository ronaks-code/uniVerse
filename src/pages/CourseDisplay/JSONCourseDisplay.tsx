import React, { useState, useMemo, useRef, Suspense, lazy } from "react";
import jsonData from "../../courses/Jun-15-2023_23_summer.json";
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
    return (jsonData as CourseData[]).map((data: CourseData) => {
      console.log(data);
      return {
        ...data,
        COURSES: data.COURSES.filter((course: Course) =>
          course.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        ),
      };
    });
  }, [debouncedSearchTerm]);

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
          {filteredCourses.map((data: CourseData, index: number) => (
            <div key={index}>
              {data.COURSES.map((course: Course, idx: number) => (
                <CourseCard key={`${index}-${idx}`} course={course} />
              ))}
            </div>
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default JSONCourseDisplay;
