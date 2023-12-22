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
  selectedSchedule: string;
}

const CoursesHandler: React.FC<CoursesHandlerProps> = ({
  onSelectSection,
  selectedSchedule,
}) => {
  const [
    {
      user,
      selectedCourses: globalSelectedCourses,
      likedCourses: globalLikedCourses,
      selectedSections: globalSelectedSections,
    },
  ] = useStateValue();

  const [globalState, dispatch] = useStateValue();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(
    globalState.debouncedSearchTerm
  );
  const [selectedCourses, setSelectedCourses] = useLocalStorage(
    `selectedCourses-${selectedSchedule}`,
    globalSelectedCourses
  );
  const [likedCourses, setLikedCourses] = useLocalStorage(
    `likedCourses-${selectedSchedule}`,
    globalLikedCourses
  );
  const [selectedSections, setSelectedSections] = useLocalStorage(
    `selectedSections-${selectedSchedule}`,
    globalSelectedSections
  );

  useEffect(() => {
    console.log("Selected Schedule:", selectedSchedule);
  }, [selectedSchedule]);

  // Initialize or re-fetch the states from local storage when selectedSchedule changes
  useEffect(() => {
    const fetchFromLocalStorage = (key: string, globalFallback: any) => {
      const dataFromLocalStorage = localStorage.getItem(key);
      return dataFromLocalStorage
        ? JSON.parse(dataFromLocalStorage)
        : globalFallback;
    };

    setSelectedCourses(
      fetchFromLocalStorage(
        `selectedCourses-${selectedSchedule}`,
        globalSelectedCourses
      )
    );
    setLikedCourses(
      fetchFromLocalStorage(
        `likedCourses-${selectedSchedule}`,
        globalLikedCourses
      )
    );
    setSelectedSections(
      fetchFromLocalStorage(
        `selectedSections-${selectedSchedule}`,
        globalSelectedSections
      )
    );
  }, [
    selectedSchedule,
    globalSelectedCourses,
    globalLikedCourses,
    globalSelectedSections,
  ]);

  useEffect(() => {
    if (user) {
      // Save data to Firebase for the selected schedule
      // TODO: Implement Firebase save logic here
    }
  }, [selectedCourses, likedCourses, selectedSections, user]);

  useEffect(() => {
    dispatch({
      type: "SET_DEBOUNCED_SEARCH_TERM",
      payload: debouncedSearchTerm,
    });
    dispatch({ type: "SET_SELECTED_COURSES", payload: selectedCourses });
    dispatch({ type: "SET_LIKED_COURSES", payload: likedCourses });
    dispatch({ type: "SET_SELECTED_SECTIONS", payload: selectedSections });
  }, [
    debouncedSearchTerm,
    selectedCourses,
    likedCourses,
    selectedSections,
    dispatch,
  ]);

  useEffect(() => {
    console.log("CoursesHandler - Selected Sections:", selectedSections);
  }, [selectedSections]);

  // useEffect(() => {
  //   // Reset the local state when the schedule changes
  //   setSelectedCourses([]);
  //   setLikedCourses([]);
  //   setSelectedSections([]);

  //   // Also, if you want to reset the global state, you can dispatch the changes as well
  //   dispatch({ type: "SET_SELECTED_COURSES", payload: [] });
  //   dispatch({ type: "SET_LIKED_COURSES", payload: [] });
  //   dispatch({ type: "SET_SELECTED_SECTIONS", payload: [] });
  // }, [
  //   selectedSchedule,
  //   dispatch,
  //   setSelectedCourses,
  //   setLikedCourses,
  //   setSelectedSections,
  // ]);

  const handleSectionsSelection = (section: SectionWithCourse) => {
    setSelectedSections((prev) => {
      if (prev.some((s) => s.classNumber === section.classNumber)) {
        return prev.filter((s) => s.classNumber !== section.classNumber);
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
