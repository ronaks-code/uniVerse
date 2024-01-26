import React, { useState, useEffect } from "react";
import LikedSelectedCourses from "./LikedSelectedCourses";
import CourseSearch from "./CourseSearch";
import ShowFilteredCourses from "./ShowFilteredCourses";
import {
  Course,
  SectionWithCourse,
  SectionWithCourseWithoutSectionsArray,
} from "../CourseUI/CourseTypes";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface CoursesHandlerProps {
  selectedSchedule: string;
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  likedCourses: Course[];
  setLikedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedSections: SectionWithCourseWithoutSectionsArray[];
  setSelectedSections: React.Dispatch<
    React.SetStateAction<SectionWithCourseWithoutSectionsArray[]>
  >;
  selectedSectionsNumbers: number[];
  setSelectedSectionsNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  onSectionSelect: (section: SectionWithCourse) => void;
}

const CoursesHandler: React.FC<CoursesHandlerProps> = ({
  selectedSchedule,
  selectedCourses,
  setSelectedCourses,
  likedCourses,
  setLikedCourses,
  selectedSections,
  setSelectedSections,
  selectedSectionsNumbers,
  setSelectedSectionsNumbers,
  onSectionSelect,
}) => {
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
            selectedSectionsNumbers={selectedSectionsNumbers}
            setSelectedSectionsNumbers={setSelectedSectionsNumbers}
            onSectionSelect={onSectionSelect}
          />
          <div className="">
            <ShowFilteredCourses
              debouncedSearchTerm={debouncedSearchTerm}
              selectedCourses={selectedCourses}
              setSelectedCourses={setSelectedCourses}
              likedCourses={likedCourses}
              setLikedCourses={setLikedCourses}
              onSectionSelect={onSectionSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesHandler;
