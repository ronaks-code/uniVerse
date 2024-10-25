import React, { useState, useRef } from "react";

// Import global state and custom hook
import { useStateValue } from "../../../context/globalState";
import useLocalStorage from "../../../hooks/useLocalStorage";

interface CourseSearchProps {
  debouncedSearchTerm: string;
  setDebouncedSearchTerm: (searchTerm: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  debouncedSearchTerm,
  setDebouncedSearchTerm,
}) => {
  const [storedSearchTerm, setStoredSearchTerm] = useLocalStorage("searchTerm", "");
  const [searchTerm, setSearchTerm] = useState(storedSearchTerm); // Initialize with stored value
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value;

    // Convert the input value to uppercase
    value = value.toUpperCase();

    // Extract the prefix
    const prefix = value.match(/[A-Z]+/)?.[0] || "";

    // Remove any spaces from the input
    const inputWithoutSpaces = value.replace(/\s/g, "");

    // Format the input with a space after the prefix if it exists
    let formattedInput = inputWithoutSpaces;
    if (prefix.length > 0 && inputWithoutSpaces.length > prefix.length) {
      formattedInput = prefix + " " + inputWithoutSpaces.slice(prefix.length);
    }

    setSearchTerm(formattedInput);

    // Debounce search input
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearchTerm(formattedInput);
    }, 300); // 300ms delay
  };

  return (
    <input
      type="text"
      placeholder="Course Code (e.g., XXX 0000)"
      value={searchTerm}
      onChange={handleSearchChange}
      autoCorrect="off"
      className="w-full max-w-[calc(100vw-3rem)] lg-xl:w-[320px] px-2 py-2 m-4 text-black bg-gray-200 rounded-md placeholder-gray-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-colors duration-500"
    />
  );
};

export default CourseSearch;
