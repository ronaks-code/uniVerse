import React, { useState, useEffect, forwardRef, useRef } from "react";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { PiPlusBold } from "react-icons/pi";
import { topNavClasses } from "./topNavClasses";
import Schedule from "./TopNav";
import IconGroup from "./IconGroup";
import { auth } from "../../services/firebase";

import useLocalStorage from "../../hooks/useLocalStorage";
import LikedSelectedCourses from "../CourseDisplay/CoursesHandler/LikedSelectedCourses";

interface NewScheduleDropdownProps {
  schedules: any[];
  selectedSchedule: string;
  onSelectSchedule: (schedule: string) => void;
  onRename: (schedule: string, newName: string) => void;
  onCopy: (schedule: string, newName: string) => void;
  onDelete: (schedule: string) => void;
  onAddNew: () => void;
}

const NewScheduleDropdown = forwardRef<
  HTMLDivElement,
  NewScheduleDropdownProps
>(
  (
    {
      schedules,
      selectedSchedule,
      onSelectSchedule,
      onRename,
      onCopy,
      onDelete,
      onAddNew,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isRenaming, setIsRenaming] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState("");
    const [originalValue, setOriginalValue] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          isOpen &&
          !dropdownRef.current?.contains(event.target as Node) &&
          !buttonRef.current?.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      // Listen for clicks outside to close the dropdown
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleToggleDropdown = (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
      event.stopPropagation(); // Stop click from propagating to the outside click listener
      setIsOpen(!isOpen);
    };

    const handleRename = (schedule: string) => {
      if (!schedule) {
        console.error("handleRename: Schedule is undefined or null");
        return;
      }

      console.log("handleRename called with", schedule);
      setIsRenaming(schedule);
      setRenameValue(schedule);
      setOriginalValue(schedule); // store the original name
    };

    const handleCancelRename = () => {
      console.log("handleCancelRename called");
      console.log("Cancelling rename. Original value:", originalValue);
      setIsRenaming(null);
      setRenameValue(originalValue);
    };

    const handleRenameSubmit = (schedule: string) => {
      if (!schedule) {
        console.error("handleRenameSubmit: Schedule is undefined or null");
        return;
      }

      console.log("handleRenameSubmit called with", schedule);
      onRename(schedule, renameValue);
      setIsRenaming(null);
    };

    const handleCopy = (schedule: string) => {
      const newScheduleName = `Copy of ${schedule}`;
      onCopy(schedule, newScheduleName);
      setIsOpen(true);
    };

    // Effect to save the state to localStorage when schedules or selectedSchedule changes
    useEffect(() => {
      if (!auth.currentUser) {
        localStorage.setItem("schedules", JSON.stringify(schedules));
        localStorage.setItem("selectedSchedule", selectedSchedule);
      }
    }, [schedules, selectedSchedule]);

    return (
      <div ref={ref} className="relative cursor-pointer">
        <button
          ref={buttonRef}
          onClick={handleToggleDropdown}
          className={`${topNavClasses.Button} ${topNavClasses.SelectVersionSwitch}`}
        >
          <div className={topNavClasses.Text}>{selectedSchedule}</div>
          {isOpen ? (
            <FaCaretUp
              className={`${topNavClasses.SvgInlineFa} ${topNavClasses.FaCaret}`}
            />
          ) : (
            <FaCaretDown
              className={`${topNavClasses.SvgInlineFa} ${topNavClasses.FaCaret}`}
            />
          )}
        </button>

        {isOpen && (
          <div
            ref={dropdownRef}
            className={`absolute mt-0 w-64 bg-white dark:bg-gray-800 border border-gray-300 rounded shadow-lg transition-opacity duration-300 opacity-100 z-50`}
          >
            {schedules.map((schedule) => (
              <div
                key={schedule}
                className={`${topNavClasses.rowClasses} text-black dark:text-white`}
                onClick={() => {
                  if (isRenaming !== schedule) {
                    // console.log("Switching Schedules.\nOld Schedule: " + selectedSchedule + "\nNew Schedule: " + schedule);
                    // console.log("Data in primary: " + localStorage.getItem(`selectedCourses-${selectedSchedule}`));
                    // console.log("Data in secondary: " + localStorage.getItem(`selectedCourses-${schedule}`));
                    onSelectSchedule(schedule);
                    setIsOpen(false);
                  }
                }}
              >
                {isRenaming === schedule ? (
                  <div className="flex items-center h-[1.5em] -mx-3">
                    <input
                      className={`flex-grow border shadow-sm rounded px-2 py-1 bg-gray-100 dark:bg-[#1F2937] focus:outline-none w-[6.25rem] dark:border-[#374151] dark:border-[4px]`}
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSubmit(schedule)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSubmit(schedule);
                      }}
                      autoFocus
                    />
                    <IconGroup
                      schedules={schedules}
                      isRenamingSchedule={true}
                      schedule={schedule}
                      handleRename={handleRename}
                      handleRenameSubmit={handleRenameSubmit}
                      handleCancelRename={handleCancelRename}
                      handleCopy={handleCopy}
                      onDelete={onDelete}
                      iconClasses={topNavClasses.iconClasses}
                    />
                  </div>
                ) : (
                  <>
                    <span
                      className="mr-2 truncate block w-[calc(15rem)] group-hover:w-[calc(7rem)] transition-width duration-300"
                      onClick={() => {
                        onSelectSchedule(schedule);
                        setIsOpen(false);
                      }}
                    >
                      {schedule}
                    </span>
                    <IconGroup
                      schedules={schedules}
                      isRenamingSchedule={false}
                      schedule={schedule}
                      handleRename={handleRename}
                      handleRenameSubmit={handleRenameSubmit}
                      handleCancelRename={handleCancelRename}
                      handleCopy={handleCopy}
                      onDelete={onDelete}
                      iconClasses={topNavClasses.iconClasses}
                    />
                  </>
                )}
              </div>
            ))}
            <div
              className="flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1"
              onClick={onAddNew}
            >
              <span className="mr-2 text-black dark:text-white">
                New Schedule
              </span>
              <PiPlusBold
                className={`text-gray-500 hover:text-white cursor-pointer ${topNavClasses.iconClasses}`}
                title="Add New Schedule"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default NewScheduleDropdown;
