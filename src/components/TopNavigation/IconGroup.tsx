import React from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { PiCopyFill } from "react-icons/pi";
import { BsFillTrashFill } from "react-icons/bs";
import { FaPencilAlt } from "react-icons/fa";
import { topNavClasses } from "./topNavClasses";

type IconGroupProps = {
  schedules: any[];
  isRenamingSchedule: boolean;
  schedule: string;
  handleRename: (schedule: string) => void;
  handleRenameSubmit: (schedule: string) => void;
  handleCancelRename: () => void;
  handleCopy: (schedule: string) => void;
  onDelete: (schedule: string) => void;
  iconClasses: string;
};

const IconGroup: React.FC<IconGroupProps> = ({
  schedules,
  isRenamingSchedule,
  schedule,
  handleRename,
  handleRenameSubmit,
  handleCancelRename,
  handleCopy,
  onDelete,
  iconClasses,
}) => (
  <div
    className={`flex absolute right-0 transition-opacity 
      ${
        isRenamingSchedule ? "opacity-100" : "opacity-0 group-hover:opacity-100"
      }`}
  >
    {isRenamingSchedule ? (
      <>
        <div className={topNavClasses.iconBlock}>
          <AiOutlineCheck
            size={16}
            className={iconClasses}
            onClick={(e) => {
              console.log("+++ clicked!");
              handleRenameSubmit(schedule);
              e.stopPropagation();
            }}
            title="Confirm Rename"
          />
        </div>
        <div className={topNavClasses.iconBlock}>
          <IoClose
            size={16}
            className={iconClasses}
            onClick={(e) => {
              console.log("X clicked!");
              handleCancelRename();
              e.stopPropagation();
            }}
            title="Cancel Rename"
          />
        </div>
      </>
    ) : (
      <div className={topNavClasses.iconBlock}>
        <FaPencilAlt
          size={16}
          className={iconClasses}
          onClick={(e) => {
            handleRename(schedule);
            e.stopPropagation();
          }}
          title="Rename Schedule"
        />
      </div>
    )}
    <div className={topNavClasses.iconBlock}>
      <PiCopyFill
        className={iconClasses}
        onClick={(e) => {
          handleCopy(schedule);
          e.stopPropagation();
        }}
        title="Create a Copy"
      />
    </div>
    {schedules.length > 1 && (
      <div className={topNavClasses.iconBlock}>
        <BsFillTrashFill
          className={iconClasses}
          onClick={(e) => {
            onDelete(schedule);
            e.stopPropagation();
          }}
          title="Delete Schedule"
        />
      </div>
    )}
  </div>
);

export default IconGroup;
