// export const JSONCourseDisplayClasses = {
//   container: "overflow-y-scroll bg-white dark:bg-gray-800 transition-colors duration-200 ease-in-out",
//   chatContainer: "transition-all duration-500 ease-in-out flex-basis-0",  // Initially hidden
//   calendarContainer: "transition-all duration-500 ease-in-out flex-grow"   // Takes all available space
// };

export const JSONCourseDisplayClasses = {
  container:
    "overflow-y-scroll bg-white dark:bg-gray-800 transition-colors duration-500 ease-in-out",
  chatContainer:
    "transition-all duration-500 ease-in-out overflow-hidden flex-shrink-0", // flex-shrink-0 to prevent shrinking
  calendarContainer: "transition-all duration-500 ease-in-out flex-grow", // Takes all available space
};
