import React, { useState, useEffect } from "react";
import LikedSelectedCourses from "./LikedSelectedCourses";
import CourseSearch from "./CourseSearch";
import ShowFilteredCourses from "./ShowFilteredCourses";
import { Course, SectionWithCourse, Schedule } from "../CourseUI/CourseTypes";

// Import global state and custom hook
import { useStateValue } from "../../../context/globalState";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface CoursesHandlerProps {
  onSelectSection: (section: SectionWithCourse) => void;
}

const CoursesHandler: React.FC<CoursesHandlerProps & { selected: string, schedules: Schedule[] }> = ({ onSelectSection, selected, schedules }) => {
  const [globalState, dispatch] = useStateValue();

  // Use React's local state for debouncedSearchTerm
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(globalState.debouncedSearchTerm);

  // Use local storage hook for the rest of the state variables
  const [selectedCourses, setSelectedCourses] = useLocalStorage("selectedCourses", globalState.selectedCourses);
  const [likedCourses, setLikedCourses] = useLocalStorage("likedCourses", globalState.likedCourses);
  const [selectedSections, setSelectedSections] = useLocalStorage("selectedSections", globalState.selectedSections);

  useEffect(() => {
    // Update global state whenever local state changes
    dispatch({ type: "SET_DEBOUNCED_SEARCH_TERM", payload: debouncedSearchTerm });
    dispatch({ type: "SET_SELECTED_COURSES", payload: selectedCourses });
    dispatch({ type: "SET_LIKED_COURSES", payload: likedCourses });
    dispatch({ type: "SET_SELECTED_SECTIONS", payload: selectedSections });
  }, [debouncedSearchTerm, selectedCourses, likedCourses, selectedSections, dispatch]);

  // Effect to log selectedSections when it changes
  useEffect(() => {
    console.log("CoursesHandler - Selected Sections:", selectedSections);
  }, [selectedSections]);

  // Function to handle section selection
  const handleSectionsSelection = (section: SectionWithCourse) => {
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
        <div className="sticky top-0">
          <CourseSearch
            debouncedSearchTerm={debouncedSearchTerm}
            setDebouncedSearchTerm={setDebouncedSearchTerm}
          />
        </div>

        <div className="flex-grow overflow-y-auto pb-4">
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
