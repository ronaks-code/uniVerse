import React, { useState, useRef } from "react";
import { ShowFilteredCoursesClasses } from "../ShowFilteredCourses/ShowFilteredCoursesClasses";

interface CourseSearchProps {
  debouncedSearchTerm: string;
  setDebouncedSearchTerm: (searchTerm: string) => void;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  debouncedSearchTerm,
  setDebouncedSearchTerm,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debounceRef = useRef<NodeJS.Timeout>(); // Store the timeout reference

  const { input } = ShowFilteredCoursesClasses;

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
      placeholder="Search by course code (e.g., XXX 0000)"
      value={searchTerm}
      onChange={handleSearchChange}
      autoCorrect="off"
      className={input}
    />
  );
};

export default CourseSearch;
