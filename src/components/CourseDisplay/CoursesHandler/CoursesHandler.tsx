import React, { useState, useEffect } from "react";
import LikedSelectedCourses from "./LikedSelectedCourses";
import CourseSearch from "./CourseSearch";
import ShowFilteredCourses from "./ShowFilteredCourses";
import { Course, SectionWithCourseCode } from "../CourseUI/CourseTypes";

interface CoursesHandlerProps {
  onSelectSection: (section: SectionWithCourseCode) => void;
}

const CoursesHandler: React.FC<CoursesHandlerProps> = ({ onSelectSection}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<Course[]>([]);
  const [likedCourses, setLikedCourses] = useState<Course[]>([]);
  const [selectedSections, setSelectedSections] = useState<
    SectionWithCourseCode[]
  >([]);

  // Effect to log selectedSections when it changes
  useEffect(() => {
    console.log("CoursesHandler - Selected Sections:", selectedSections);
  }, [selectedSections]);

  // Function to handle section selection
  const handleSectionsSelection = (section: SectionWithCourseCode) => {
    setSelectedSections(prev => {
      if (prev.some(s => s.number === section.number)) {
        return prev.filter(s => s.number !== section.number);
      } else {
        return [...prev, section];
      }
    });

    onSelectSection(section);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-3xl transition-shadow duration-300 courseHandlerScrollbar max-h-[calc(100vh)]">
      <div className="overflow-y-scroll lg-xl:mb-0 pb-4 flex flex-col max-h-[calc(100vh-4rem)] lg-xl:max-h-[calc(100vh-2rem)]">
        <div className="sticky top-0 lg-xl:pl-14">
          <CourseSearch
            debouncedSearchTerm={debouncedSearchTerm}
            setDebouncedSearchTerm={setDebouncedSearchTerm}
          />
        </div>

        <div className="flex-grow overflow-y-auto pb-4">
          {/* The rest of your content */}
          <LikedSelectedCourses
            selectedCourses={selectedCourses}
            likedCourses={likedCourses}
            setSelectedCourses={setSelectedCourses}
            setLikedCourses={setLikedCourses}
            onSelectSection={handleSectionsSelection}
          />
          <div className="">
            <ShowFilteredCourses
              debouncedSearchTerm={debouncedSearchTerm}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              likedCourses={likedCourses}
              setLikedCourses={setLikedCourses}
              onSelectSection={handleSectionsSelection}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHandler;
