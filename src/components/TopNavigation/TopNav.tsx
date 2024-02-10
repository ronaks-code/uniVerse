import { useState, useEffect, useContext, useRef } from "react";
import {
  Course,
  SectionWithCourse,
} from "../CourseDisplay/CourseUI/CourseTypes";
import HomeButton from "./HomeButton";
import NewScheduleDropdown from "./NewScheduleDropdown";
import ThemeIcon from "./ThemeIcon";
import UserProfileOrSignIn from "./UserProfileOrSignIn";
import { FaSearch, FaRegBell } from "react-icons/fa";
import { AiOutlineLoading, AiOutlineLoading3Quarters } from "react-icons/ai";
import { VscLoading } from "react-icons/vsc";
import {
  firestore,
  auth,
  addNewSchedule,
  getAllSchedules,
  renameSchedule,
  updateSchedule,
  deleteSchedule,
} from "../../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { FirebaseContext } from "../../context/FirebaseContext";

export type Schedule = {
  name: string;
  selectedCourses: Course[];
  likedCourses: Course[];
  selectedSections: SectionWithCourse[];
};

const LoadingAnimation = () => (
  <div className="flex justify-center items-center">
    <AiOutlineLoading className="loading-icon animate-fadeInOutScaleSpin delay-0" />
    <VscLoading className="loading-icon animate-fadeInOutScaleSpin delay-1000" />
    <AiOutlineLoading3Quarters className="loading-icon animate-fadeInOutScaleSpin delay-2000" />
  </div>
);

interface TopNavigationProps {
  selected: string;
  setSelected: (selected: string) => void;
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  selected,
  setSelected,
}) => {
  // Default schedules
  const defaultSchedules: Schedule[] = [
    {
      name: "Primary",
      selectedCourses: [],
      likedCourses: [],
      selectedSections: [],
    },
  ];

  // Migrate old schedule structure to new structure if necessary
  const migrateToObjectFormat = (oldSchedules: any[]): Schedule[] => {
    if (oldSchedules.length && typeof oldSchedules[0] === "string") {
      return oldSchedules.map((name) => ({
        name: name,
        selectedCourses: [],
        likedCourses: [],
        selectedSections: [],
      }));
    }
    return oldSchedules;
  };

  // Retrieve saved state from localStorage or use default values
  const savedSchedules = migrateToObjectFormat(
    JSON.parse(localStorage.getItem("schedules") || "[]")
  );
  const savedSelected = localStorage.getItem("selectedSchedule");

  // [selected, setSelected] = useState(savedSelected);

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

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setLoading(true); // Start loading when fetching begins
      if (user) {
        // Fetch schedules from Firestore when user is authenticated
        console.log(
          "User is authenticated. Fetching schedules from Firestore."
        );
        getAllSchedules(user.uid).then((fetchedSchedules) => {
          console.log("Fetched schedules from firestore:", fetchedSchedules);
          setSchedules(fetchedSchedules);
          setLoading(false); // Stop loading when fetching completes
        });
      } else {
        // Fetch schedules from localStorage when user is not authenticated
        const localSchedules = JSON.parse(
          localStorage.getItem("schedules") || "[]"
        );
        setSchedules(migrateToObjectFormat(localSchedules));
        setLoading(false); // Stop loading as local fetch is almost instant
      }
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const handleAddNew = () => {
    // Determine the name based on the number of existing schedules
    const newName = scheduleNames[schedules.length];

    if (newName) {
      if (auth.currentUser) {
        const userId = auth?.currentUser?.uid;
        // Add the new schedule to Firestore
        addNewSchedule(userId, newName)
          .then(() => {
            // Fetch the updated schedules from Firestore
            return getAllSchedules(userId);
          })
          .then((updatedSchedules) => {
            setSchedules(
              updatedSchedules.map(
                (schedule: { name: string }) => schedule.name
              )
            );
          });
      } else {
        // Add the new schedule to localStorage
        const newSchedule = {
          name: newName,
          selectedCourses: [],
          likedCourses: [],
          selectedSections: [],
        };
        const updatedSchedules = [...schedules, newSchedule];
        localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
        // console.log("New schedule added successfully!: " + newName);
        setSchedules(updatedSchedules);
      }
    } else {
      console.error("Maximum number of schedules reached.");
    }
  };

  const handleRename = async (oldName: string, newName: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      console.error("User is not authenticated");
      return;
    }

    const renamedSchedule = schedules.find(
      (schedule) => schedule.name === oldName
    );
    if (!renamedSchedule) {
      console.error("Could not find schedule with name:", oldName);
      return;
    }

    renamedSchedule.name = newName; // Rename the schedule

    try {
      await renameSchedule(uid, oldName, renamedSchedule);
      console.log("Schedule renamed successfully!");

      // Update local state
      const updatedSchedules = schedules.map((schedule) =>
        schedule.name === oldName ? renamedSchedule : schedule
      );
      setSchedules(updatedSchedules);
      setSelected(newName); // update the selected schedule as well
    } catch (error) {
      console.error("Error renaming schedule:", error);
    }
  };

  const handleCopy = (
    originalScheduleName: string,
    copiedScheduleName: string
  ) => {
    // Find the original schedule
    const originalSchedule = schedules.find(
      (schedule) => schedule.name === originalScheduleName
    );

    // If original schedule is found, create a copy and add to schedules
    if (originalSchedule) {
      const copiedSchedule: Schedule = {
        name: copiedScheduleName,
        selectedCourses: [...originalSchedule.selectedCourses],
        likedCourses: [...originalSchedule.likedCourses],
        selectedSections: [...originalSchedule.selectedSections],
      };

      const updatedSchedules = [...schedules, copiedSchedule];

      if (auth.currentUser) {
        // Update schedule in Firestore (pseudo function call; actual implementation needed)
        updateSchedule(
          auth.currentUser.uid,
          originalScheduleName,
          updatedSchedules
        );
      } else {
        // Update schedule in localStorage
        localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
      }
    } else {
      console.error("Could not find original schedule:", originalScheduleName);
    }
  };

  const handleDelete = (scheduleName: string) => {
    if (auth.currentUser) {
      const authenticatedUserId = auth.currentUser.uid;
      // Delete schedule from Firestore
      deleteSchedule(authenticatedUserId, scheduleName)
        .then(() => {
          // Fetch the updated schedules from Firestore
          return getAllSchedules(authenticatedUserId);
        })
        .then((updatedSchedules) => {
          setSchedules(updatedSchedules);
        });
    } else {
      // Delete schedule from localStorage
      const updatedSchedules = schedules.filter(
        (schedule) => schedule.name !== scheduleName
      );
      localStorage.setItem("schedules", JSON.stringify(updatedSchedules));
      setSchedules(updatedSchedules);
    }
  };

  let user = useContext(FirebaseContext)?.user;
  let email = user?.email;
  let signInMethod = user?.signInMethod;

  return (
    <div className="top-navigation flex justify-between items-center">
      <div className="flex items-center">
        <HomeButton />
        <div className="ml-4">
          {loading ? (
            <LoadingAnimation />
          ) : (
            <NewScheduleDropdown
              schedules={schedules
                .filter((schedule) => schedule && schedule.name)
                .map((schedule) => schedule.name)}
              selectedSchedule={selected}
              onSelectSchedule={(schedule) => {
                // console.log(`${schedule} selected`);
                setSelected(schedule);
              }}
              onRename={handleRename}
              onCopy={handleCopy}
              onDelete={handleDelete}
              onAddNew={handleAddNew}
            />
          )}
        </div>
        {/* <p>{email}</p> */}
        {/* <p>{signInMethod}</p> */}
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
