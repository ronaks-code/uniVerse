import React, { useState, useEffect } from "react";
import LikedSelectedCourses from "./LikedSelectedCourses";
import CourseSearch from "./CourseSearch";
import ShowFilteredCourses from "./ShowFilteredCourses";
import { Course, SectionWithCourse } from "../CourseUI/CourseTypes";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface CoursesHandlerProps {
  onSelectSection: (section: SectionWithCourse) => void;
  selectedSchedule: string;
}

const CoursesHandler: React.FC<CoursesHandlerProps> = ({
  onSelectSection,
  selectedSchedule,
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

  // Fetch or initialize states from local storage whenever selectedSchedule changes
  useEffect(() => {
    // Function to fetch from local storage or initialize if not present
    const fetchFromLocalStorage = (key: string) => {
      const dataFromLocalStorage = localStorage.getItem(key);
      return dataFromLocalStorage ? JSON.parse(dataFromLocalStorage) : [];
    };

    console.log("_________________________________________________");
    console.log("*Selected Schedule has changed to:", selectedSchedule);

    // setSelectedCourses(
    //   fetchFromLocalStorage(`selectedCourses-${selectedSchedule}`)
    // );
    // setLikedCourses(fetchFromLocalStorage(`likedCourses-${selectedSchedule}`));
    // setSelectedSections(
    //   fetchFromLocalStorage(`selectedSections-${selectedSchedule}`)
    // );

    // console.log("Selected Courses:", selectedCourses);
    // console.log("Liked Courses:", likedCourses);
    // console.log("Selected Sections:", selectedSections);
    // console.log("Primary Data: " + localStorage.getItem("selectedCourses-Primary") + "\n" + localStorage.getItem("likedCourses-Primary") + "\n" + localStorage.getItem("selectedSections-Primary") + "\n***********************************************************************************");
    // console.log("Secondary Data: " + localStorage.getItem("selectedCourses-Secondary") + "\n" + localStorage.getItem("likedCourses-Secondary") + "\n" + localStorage.getItem("selectedSections-Secondary") + "\n***********************************************************************************");
    // console.log("Tertiary Data: " + localStorage.getItem("selectedCourses-Tertiary") + "\n" + localStorage.getItem("likedCourses-Tertiary") + "\n" + localStorage.getItem("selectedSections-Tertiary") + "\n***********************************************************************************");
  }, [selectedSchedule]);

  // useEffect(() => {
  //   console.log(
  //     "Primary Data: " +
  //       localStorage.getItem("selectedCourses-Primary") +
  //       "\n" +
  //       localStorage.getItem("likedCourses-Primary") +
  //       "\n" +
  //       localStorage.getItem("selectedSections-Primary") +
  //       "\n***********************************************************************************"
  //   );
  //   console.log(
  //     "Secondary Data: " +
  //       localStorage.getItem("selectedCourses-Secondary") +
  //       "\n" +
  //       localStorage.getItem("likedCourses-Secondary") +
  //       "\n" +
  //       localStorage.getItem("selectedSections-Secondary") +
  //       "\n***********************************************************************************"
  //   );
  // });

  const handleSectionsSelection = (section: SectionWithCourse) => {
    setSelectedSections((prev) => {
      if (prev.some((s) => s.classNumber === section.classNumber)) {
        return prev.filter((s) => s.classNumber !== section.classNumber);
      } else {
        return [...prev, section];
      }
    });

    console.log("FKLDSJLKDFJSDFKJLFDK:SJFLKJSKL:DFSelected Sections:", selectedSections);

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
            selectedSchedule={selectedSchedule}
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
