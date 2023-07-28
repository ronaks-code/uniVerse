export const CalendarUIClasses = {
  calendar:
    "Calendar calendar grid grid-cols-6 gap-0.4 divide-x border border-gray-400 dark:border-gray-500 rounded-lg p-4 sm:p-6 m-2 sm:m-4 transition-colors duration-200 ease-in-out w-full sm:min-w-[95%] max-w-full ml-16",
  dayColumn:
    "day-column grid grid-rows-16 gap-0.4 divide-y border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out",
  dayHeader:
    "h-10 bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-900 dark:text-gray-100 text-sm",
  timeSlot:
    "time-slot flex items-center px-3 text-gray-900 dark:text-gray-300 border-t border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out text-sm min-w-full min-h-[2rem] sm:min-h-[2.5rem] lg:min-h-[3rem] xl:min-h-[3.5rem]",
  timeColumn:
    "time-column flex flex-col justify-between border-gray-400 dark:border-gray-600 transition-colors duration-100 ease-in-out text-sm min-w-fit sm:min-w-fit lg:min-w-fit xl:min-w-fit",
  times:
    "times flex flex-col absolute left-0 right-0 top-0 bottom-0",
  time:
    "time flex flex-grow-1 flex-shrink-1 basis-[0%] top-[-0.5rem] relative",
  label:
    "label block font-size-0.8em font-weight-700 pr-[8px] text-right w-48px",
  days:
    "days flex left-0 right-0 top-[-40px] bottom-0 absolute",
  day:
    "day flex flex-grow-1 flex-shrink-1 basis-[0%] flex-col relative",
};

export const CalendarStyles = {
  calendar: "Calendar",
  times: "times dark:text-gray-300",
  time: "time",
  label: "label",
  days: "days dark:text-gray-100",
  day: "day",
  meetings: "my-meetings",
};
