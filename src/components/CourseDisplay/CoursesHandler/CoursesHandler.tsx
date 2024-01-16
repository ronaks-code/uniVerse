import React, { useState, useEffect } from "react";
import LikedSelectedCourses from "./LikedSelectedCourses";
import CourseSearch from "./CourseSearch";
import ShowFilteredCourses from "./ShowFilteredCourses";
import { Course, SectionWithCourse } from "../CourseUI/CourseTypes";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface CoursesHandlerProps {
  selectedSchedule: string;
  onSectionSelect: (section: SectionWithCourse) => void;
}

const CoursesHandler: React.FC<CoursesHandlerProps> = ({
  selectedSchedule,
  onSectionSelect,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  // Initialize from local storage directly
  const [selectedCourses, setSelectedCourses] = useLocalStorage<Course[]>(
    `selectedCourses-${selectedSchedule}`,
    []
  );
  const [likedCourses, setLikedCourses] = useLocalStorage<Course[]>(
    `likedCourses-${selectedSchedule}`,
    []
  );
  // Explicitly define the type of the state as an array of SectionWithCourse
  const [selectedSections, setSelectedSections] = useLocalStorage<
    SectionWithCourse[]
  >(`selectedSections-${selectedSchedule}`, []);

  const handleSectionsSelection = (section: SectionWithCourse) => {
    setSelectedSections((prev) => {
      if (prev.some((s) => s.classNumber === section.classNumber)) {
        // console.log("1")
        return prev.filter((s) => s.classNumber !== section.classNumber);
      } else {
        // console.log("2")
        return [...prev, section];
      }
    });

    // console.log("3")
    onSectionSelect(section);
    // console.log("4")
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-3xl transition-shadow duration-300 courseHandlerScrollbar max-h-[calc(100vh)]">
      <div className="overflow-y-scroll lg-xl:mb-0 pb-4 flex flex-col max-h-[calc(100vh-4rem)] lg-xl:max-h-[calc(100vh-2rem)]">
        <div className="sticky top-0">
          <CourseSearch
            debouncedSearchTerm={debouncedSearchTerm}
            setDebouncedSearchTerm={setDebouncedSearchTerm}
          />
        </div>
        <div className="flex-grow overflow-y-auto pb-4">
          <LikedSelectedCourses
            selectedSchedule={selectedSchedule}
            likedCourses={likedCourses}
            setLikedCourses={setLikedCourses}
            selectedCourses={selectedCourses}
            setSelectedCourses={setSelectedCourses}
            selectedSections={selectedSections}
            setSelectedSections={setSelectedSections}
            onSectionSelect={handleSectionsSelection}
          />
          <div className="">
            <ShowFilteredCourses
              debouncedSearchTerm={debouncedSearchTerm}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              likedCourses={likedCourses}
              setLikedCourses={setLikedCourses}
              onSectionSelect={handleSectionsSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHandler;
