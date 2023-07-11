export const CalendarUIClasses = {
  mainContainer:
    "bg-white dark:bg-gray-800 transition-colors duration-200 ease-in-out w-1/2",
  calendar:
    "grid grid-cols-6 gap-0.4 divide-x border border-gray-400 dark:border-gray-500 rounded-lg p-4 sm:p-6 m-2 sm:m-4 transition-colors duration-200 ease-in-out w-full sm:min-w-[95%] max-w-full ml-16", // Increase grid-cols to 6
  dayColumn:
    "grid grid-rows-16 gap-0.4 divide-y border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out",
  dayHeader:
    "h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-900 dark:text-gray-100 text-sm",
  timeSlot:
    "flex items-center px-3 text-gray-900 dark:text-gray-300 border-t border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out text-sm min-w-full min-h-[2rem] sm:min-h-[2.5rem] lg:min-h-[3rem] xl:min-h-[3.5rem]",
  timeColumn:
    "flex flex-col justify-between border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out text-sm min-w-fit sm:min-w-fit lg:min-w-fit xl:min-w-fit",
};
