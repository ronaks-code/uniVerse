import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import {
  Course,
  SectionWithCourse,
  SectionWithCourseWithoutSectionsArray,
} from "../CourseUI/CourseTypes";
import ColorHash from "color-hash";
import chroma from "chroma-js";
import CourseDropdown from "../CourseUI/CourseDropdown";
import { PiCaretDownBold, PiCaretUpBold, PiTrashBold } from "react-icons/pi";
import { useStateValue } from "../../../context/globalState";
import { updateDoc, arrayUnion, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firestore } from "../../../services/firebase";
import { set } from "react-hook-form";

const userId = getAuth().currentUser?.email || localStorage.getItem("userId");
const isUserSignedIn = !!getAuth().currentUser;

// Function to update liked courses in Firebase
const updateLikedCoursesInFirebase = async (courseCode: string) => {
  if (!userId) {
    console.error("User ID is not available.");
    return;
  }
  const userDocRef = doc(firestore, "users", userId);
  await updateDoc(userDocRef, {
    likedCourses: arrayUnion(courseCode),
  });
};

// Function to update selected courses in Firebase
const updateSelectedCoursesInFirebase = async (courseCode: string) => {
  if (!userId) {
    console.error("User ID is not available.");
    return;
  }

  const userDocRef = doc(firestore, "users", userId);
  await updateDoc(userDocRef, {
    selectedCourses: arrayUnion(courseCode),
  });
};

interface LikedSelectedCoursesProps {
  selectedSchedule: string;
  likedCourses: Course[];
  setLikedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedCourses: Course[];
  setSelectedCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  selectedSections: SectionWithCourseWithoutSectionsArray[];
  setSelectedSections: React.Dispatch<
    React.SetStateAction<SectionWithCourseWithoutSectionsArray[]>
  >;
  selectedSectionsNumbers: number[];
  setSelectedSectionsNumbers: React.Dispatch<React.SetStateAction<number[]>>;
  onSectionSelect: (section: SectionWithCourse) => void;
}

const colorHash = new ColorHash({
  saturation: [0.8, 0.6],
  lightness: [0.6],
});

// Create a Map to store the number of colors for each course
const courseColorCounts = new Map<string, number>();

const getGradientColors = (course: Course) => {
  const courseKey = course.code + course.name;
  let colorCount: number;

  if (courseColorCounts.has(courseKey)) {
    colorCount = courseColorCounts.get(courseKey) as number;
  } else {
    // Randomly choose to use 2 or 3 colors and save the count
    // ! Uncomment line below if you want to use 2 or 3 colors
    // colorCount = Math.random() < 0.5 ? 2 : 3;
    colorCount = 2;
    courseColorCounts.set(courseKey, colorCount);
  }

  const baseColorHex = colorHash.hex(courseKey);
  const baseColorHsl = chroma(baseColorHex).hsl() as [number, number, number];

  if (colorCount === 2) {
    // Complementary colors are 180 degrees apart on the color wheel
    const complementaryColorHsl: [number, number, number] = [
      (baseColorHsl[0] + 180) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];
    const complementaryColorHex = chroma.hsl(...complementaryColorHsl).hex();

    return `
      linear-gradient(135deg, ${baseColorHex} 0%, ${complementaryColorHex} 100%)
    `;
  } else {
    // Triadic colors are 120 degrees apart on the color wheel
    const triadicColor1Hsl: [number, number, number] = [
      (baseColorHsl[0] + 120) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];
    const triadicColor2Hsl: [number, number, number] = [
      (baseColorHsl[0] + 240) % 360,
      baseColorHsl[1],
      baseColorHsl[2],
    ];

    const triadicColor1Hex = chroma.hsl(...triadicColor1Hsl).hex();
    const triadicColor2Hex = chroma.hsl(...triadicColor2Hsl).hex();

    return `
      linear-gradient(135deg, ${baseColorHex} 0%, ${triadicColor1Hex} 50%, ${triadicColor2Hex} 100%)
    `;
  }
};

const LikedSelectedCourses: React.FC<LikedSelectedCoursesProps> = ({
  selectedSchedule,
  likedCourses,
  setLikedCourses,
  selectedCourses,
  setSelectedCourses,
  selectedSections,
  setSelectedSections,
  selectedSectionsNumbers,
  setSelectedSectionsNumbers,
  onSectionSelect,
}) => {
  const [user] = useStateValue();

  // Save data to Firebase when courses are liked or selected
  useEffect(() => {
    if (user) {
      // Save data to Firebase for the selected schedule
      // TODO: Implement Firebase save logic here
    } else {
      // Data is already saved using useLocalStorage hook
    }
  }, [likedCourses, selectedCourses, user]);

  // Update the liked and selected courses array when selectedSchedule changes from local storage values
  useEffect(() => {
    // Switching the selected/liked courses/sections according to the selected schedule
    setSelectedCourses(
      JSON.parse(
        localStorage.getItem(`selectedCourses-${selectedSchedule}`) || "[]"
      )
    );

    setLikedCourses(
      JSON.parse(
        localStorage.getItem(`likedCourses-${selectedSchedule}`) || "[]"
      )
    );

    setSelectedSections(
      JSON.parse(
        localStorage.getItem(`selectedSections-${selectedSchedule}`) || "[]"
      )
    );

    setSelectedSectionsNumbers(
      JSON.parse(
        localStorage.getItem(`selectedSectionsNumbers-${selectedSchedule}`) ||
          "[]"
      )
    );

    // console.log("_________________________________________________");
    // console.log("*Selected Schedule has changed to:", selectedSchedule);
    // console.log(`Data in ${selectedSchedule}: ` + localStorage.getItem(`selectedSections-${selectedSchedule}`));
  }, [selectedSchedule]);

  // useEffect(() => {
  //   console.log(
  //     "This is selected sections Primary: ",
  //     JSON.parse(localStorage.getItem(`selectedSections-Primary`) || "[]")
  //   );
  //   console.log(
  //     "This is selected sections Secondary: ",
  //     JSON.parse(localStorage.getItem(`selectedSections-Secondary`) || "[]")
  //   );
  // });

  // useEffect(() => {
  //   console.log(
  //     "This is selected courses Primary: ",
  //     JSON.parse(localStorage.getItem(`selectedCourses-Primary`) || "[]")
  //   );
  //   console.log(
  //     "This is selected courses Secondary: ",
  //     JSON.parse(localStorage.getItem(`selectedCourses-Secondary`) || "[]")
  //   );
  // });

  // useEffect(() => {
  //   console.log(
  //     "This is liked courses Primary: ",
  //     JSON.parse(localStorage.getItem(`likedCourses-Primary`) || "[]")
  //   );
  //   console.log(
  //     "This is liked courses Secondary: ",
  //     JSON.parse(localStorage.getItem(`likedCourses-Secondary`) || "[]")
  //   );
  // });

  const [activeCourses, setActiveCourses] = useState<Course[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleTrashClick = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();

    // Remove the course from selectedCourses
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.filter(
        (selectedCourse) => selectedCourse.code !== course.code
      )
    );

    // Remove the course from likedCourses
    setLikedCourses((prevLikedCourses) =>
      prevLikedCourses.filter((likedCourse) => likedCourse.code !== course.code)
    );

    // Remove all section numbers associated with the course from selectedSectionsNumbers
    setSelectedSectionsNumbers((prevSelectedSectionsNumbers) => {
      // Find the classNumbers of sections belonging to the removed course
      const sectionNumbersToRemove = selectedSections
        .filter((section) => section.code === course.code)
        .map((section) => section.classNumber);

      // Filter out these numbers from selectedSectionsNumbers
      return prevSelectedSectionsNumbers.filter(
        (number) => !sectionNumbersToRemove.includes(number)
      );
    });

    // Remove all sections associated with the course from selectedSections
    setSelectedSections((prevSelectedSections) =>
      prevSelectedSections.filter((section) => section.code !== course.code)
    );

    // Update Firebase if the user is signed in
    if (isUserSignedIn) {
      updateSelectedCoursesInFirebase(course.code);
      updateLikedCoursesInFirebase(course.code);
    }
  };

  const handleCardClick = (course: Course, event: React.MouseEvent) => {
    event.stopPropagation();
    setActiveCourses((prevActiveCourses) =>
      prevActiveCourses.includes(course)
        ? prevActiveCourses.filter(
            (activeCourse) =>
              activeCourse.code !== course.code ||
              activeCourse.name !== course.name
          )
        : [...prevActiveCourses, course]
    );
  };

  const isCourseActive = (course: Course) => activeCourses.includes(course);

  return (
    <>
      {likedCourses.length > 0 && (
        <>
          <div className="flex mb-4 select-none">
            <div className="text-purple-500 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Liked Courses
            </div>
          </div>
          <div className="mb-4 pl-2 select-none">
            {likedCourses.map((course: Course, index: number) => (
              <div key={index} className="relative">
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white max-w-[calc(100vw)] lg-xl:w-[320px] cursor-pointer h-20 overflow-hidden backdrop-filter backdrop-blur-md`}
                  style={{
                    backgroundImage: getGradientColors(course),
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={(event) => handleCardClick(course, event)}
                >
                  <div className="flex flex-row">
                    <div className="mr-auto">
                      {course.termInd !== " " && course.termInd !== "C" ? (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")} -{" "}
                          {course.termInd}
                        </strong>
                      ) : (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")}
                        </strong>
                      )}
                    </div>
                    <div
                      className="mx-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={16} />
                      ) : (
                        <PiCaretDownBold size={16} />
                      )}
                    </div>
                    <button
                      className="ml-1 h-0"
                      onClick={(event) => handleTrashClick(course, event)}
                    >
                      <PiTrashBold size={16} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div
                    className="max-w-[calc(100vw-2.5rem)] lg-xl:w-[320px] pl-4"
                    ref={dropdownRef}
                  >
                    <CourseDropdown
                      course={course}
                      onSectionSelect={onSectionSelect}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
      {selectedCourses.length > 0 && (
        <>
          <div className="flex mb-4 select-none">
            <div className="text-purple-700 dark:text-purple-100 border-purple-700 border-2 rounded-full px-3 py-1 text-sm font-semibold bg-white bg-opacity-100 dark:bg-gray-900 dark:bg-opacity-20 backdrop-filter backdrop-blur-md">
              Selected Courses
            </div>
          </div>
          <div className="mb-4 pl-2">
            {selectedCourses.map((course: Course, index: number) => (
              <div key={index} className="relative select-none">
                <div
                  className={`flex flex-col relative px-4 py-2 rounded-md m-2 text-black dark:text-white max-w-[calc(100vw)] lg-xl:w-[320px] cursor-pointer h-20 overflow-hidden backdrop-filter backdrop-blur-md`}
                  style={{
                    backgroundImage: getGradientColors(course),
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  onClick={(event) => handleCardClick(course, event)}
                >
                  <div className="flex flex-row">
                    <div className="mr-auto">
                      {course.termInd !== " " && course.termInd !== "C" ? (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")} -{" "}
                          {course.termInd}
                        </strong>
                      ) : (
                        <strong>
                          {course.code.replace(/([A-Z]+)/g, "$1 ")}
                        </strong>
                      )}
                    </div>
                    <div
                      className="mx-1"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleCardClick(course, event);
                      }}
                    >
                      {isCourseActive(course) ? (
                        <PiCaretUpBold size={16} />
                      ) : (
                        <PiCaretDownBold size={16} />
                      )}
                    </div>
                    <button
                      className="ml-1 h-0"
                      onClick={(event) => handleTrashClick(course, event)}
                    >
                      <PiTrashBold size={16} />
                    </button>
                  </div>
                  <div className="text-sm line-clamp-1 overflow-ellipsis overflow-hidden">
                    {course.name}
                  </div>
                </div>
                {isCourseActive(course) && (
                  <div
                    className="max-w-[calc(100vw-2.5rem)] lg-xl:w-[320px] pl-4"
                    ref={dropdownRef}
                  >
                    <CourseDropdown
                      course={course}
                      onSectionSelect={onSectionSelect}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default LikedSelectedCourses;
