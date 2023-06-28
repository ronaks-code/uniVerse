import React from 'react';
import ReactDOM from 'react-dom';
import CourseCard from '../../components/CourseCard/CourseCard'; // Update the import path as per your directory structure
import jsonData from '../../courses/Jun-15-2023_23_summer.json';
import { Course } from '../../components/CourseCard/CourseTypes'; // Update the import path as per your directory structure

type CourseData = {
  COURSES: Course[];
};

const DisplayCourses: React.FC = () => {
  return (
    <div>
      {(jsonData as CourseData[]).map((data: CourseData, index: number) => (
        <div key={index}>
          {data.COURSES.map((course: Course, idx: number) => (
            <CourseCard key={`${index}-${idx}`} course={course} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DisplayCourses;

