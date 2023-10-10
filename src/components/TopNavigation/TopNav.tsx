import { useState } from "react";
import {
  Course,
  SectionWithCourse,
} from "../CourseDisplay/CourseUI/CourseTypes";
import HomeButton from "./HomeButton";
import NewScheduleDropdown from "./NewScheduleDropdown";
import ThemeIcon from "./ThemeIcon";
import UserProfileOrSignIn from "./UserProfileOrSignIn";
import { FaSearch, FaRegBell } from "react-icons/fa";

type Schedule = {
  name: string;
  selectedCourses: Course[];
  selectedSections: SectionWithCourse[];
};

const TopNavigation = () => {
  // Default schedules
  const defaultSchedules: Schedule[] = [
    { name: "Primary", selectedCourses: [], selectedSections: [] },
    { name: "Secondary", selectedCourses: [], selectedSections: [] },
    { name: "Tertiary", selectedCourses: [], selectedSections: [] },
  ];

  // Migrate old schedule structure to new structure if necessary
  const migrateOldStructure = (oldSchedules: any[]): Schedule[] => {
    if (oldSchedules.length && typeof oldSchedules[0] === "string") {
      return oldSchedules.map((name) => ({
        name: name,
        selectedCourses: [],
        selectedSections: [],
      }));
    }
    return oldSchedules;
  };

  // Retrieve saved state from localStorage or use default values
  const savedSchedules = migrateOldStructure(
    JSON.parse(localStorage.getItem("schedules") || "[]")
  );
  const savedSelected = localStorage.getItem("selectedSchedule") || "Primary";

  const [selected, setSelected] = useState(savedSelected);
  const [schedules, setSchedules] = useState(
    savedSchedules.length ? savedSchedules : defaultSchedules
  );
  const scheduleNames = [
    "Primary",
    "Secondary",
    "Tertiary",
    "Quaternary",
    "Quinary",
    "Senary",
    "Septenary",
    "Octonary",
    "Nonary",
    "Denary",
  ];

  const handleAddNew = () => {
    if (schedules.length < scheduleNames.length) {
      const newSchedule: Schedule = {
        name: scheduleNames[schedules.length],
        selectedCourses: [],
        selectedSections: [],
      };
      setSchedules((prevSchedules) => [...prevSchedules, newSchedule]);
    }
  };

  const handleRename = (oldName: string, newName: string) => {
    const updatedSchedules = schedules.map((schedule) => {
      if (schedule.name === oldName) {
        return { ...schedule, name: newName };
      }
      return schedule;
    });
    setSchedules(updatedSchedules);
    setSelected(newName); // update the selected schedule as well
  };

  const handleCopy = (
    originalScheduleName: string,
    copiedScheduleName: string
  ) => {
    console.log(
      "handleCopy called with:",
      originalScheduleName,
      copiedScheduleName
    );

    // Find the original schedule
    const originalSchedule = schedules.find(
      (schedule) => schedule.name === originalScheduleName
    );

    // If original schedule is found, create a copy and add to schedules
    if (originalSchedule) {
      const copiedSchedule: Schedule = {
        name: copiedScheduleName,
        selectedCourses: [...originalSchedule.selectedCourses],
        selectedSections: [...originalSchedule.selectedSections],
      };
      setSchedules((prevSchedules) => [...prevSchedules, copiedSchedule]);
    } else {
      console.error("Could not find original schedule:", originalScheduleName);
    }
  };

  return (
    <div className="top-navigation flex justify-between items-center">
      <div className="flex items-center">
        <HomeButton />
        <div className="ml-4">
          <NewScheduleDropdown
            schedules={schedules
              .filter((schedule) => schedule && schedule.name)
              .map((schedule) => schedule.name)}
            selectedSchedule={selected}
            onSelectSchedule={(schedule) => {
              console.log(`${schedule} selected`);
              setSelected(schedule);
            }}
            onRename={handleRename}
            onCopy={handleCopy}
            onDelete={(scheduleName) => {
              console.log(`Delete ${scheduleName}`);
              setSchedules(
                schedules.filter((schedule) => schedule.name !== scheduleName)
              );
            }}
            onAddNew={handleAddNew}
          />
        </div>
      </div>
      <div className="flex items-center">
        <div className="mr-4">
          <ThemeIcon />
        </div>
        <UserProfileOrSignIn />
      </div>
    </div>
  );
};

const Search = () => (
  <div className="search">
    <input className="search-input" type="text" placeholder="Search..." />
    <FaSearch size={18} className="text-secondary my-auto" />
  </div>
);

const BellIcon = () => <FaRegBell size={24} className="top-navigation-icon" />;

const UserCircle = () => {
  // Your user circle code here
};

const Title = () => <h5 className="title-text">tailwind-css</h5>;

export default TopNavigation;
