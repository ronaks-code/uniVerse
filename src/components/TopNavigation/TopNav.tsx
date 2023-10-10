import { useState } from "react";
import HomeButton from "./HomeButton";
import NewScheduleDropdown from "./NewScheduleDropdown";
import ThemeIcon from "./ThemeIcon";
import UserProfileOrSignIn from "./UserProfileOrSignIn";
import { FaSearch, FaRegBell } from "react-icons/fa";

const TopNavigation = () => {
  // Default schedules
  const defaultSchedules = ["Primary", "Secondary", "Tertiary"];

  // Retrieve saved state from localStorage or use default values
  const savedSchedules = JSON.parse(localStorage.getItem("schedules") || "[]");
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
      setSchedules([...schedules, scheduleNames[schedules.length]]);
    }
  };

  const handleRename = (oldName: string, newName: string) => {
    const updatedSchedules = schedules.map((schedule: string) => {
      if (schedule === oldName) {
        return newName;
      }
      return schedule;
    });
    setSchedules(updatedSchedules);
    setSelected(newName); // update the selected schedule as well
  };

  const handleCopy = (originalSchedule: string, copiedScheduleName: string) => {
    // Check if the copied name already exists and handle accordingly.
    // Here, I'm just adding the copied name to the list, but you might want to add checks to ensure no duplicates.
    setSchedules((prevSchedules: string[]) => [...prevSchedules, copiedScheduleName]);
  };

  return (
    <div className="top-navigation flex justify-between items-center">
      <div className="flex items-center">
        <HomeButton />
        <div className="ml-4">
          <NewScheduleDropdown
            schedules={schedules}
            selectedSchedule={selected}
            onSelectSchedule={(schedule) => {
              console.log(`${schedule} selected`);
              setSelected(schedule);
            }}
            onRename={handleRename}
            onCopy={handleCopy}
            onDelete={(schedule) => {
              console.log(`Delete ${schedule}`);
              setSchedules(schedules.filter((s: string) => s !== schedule));
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
