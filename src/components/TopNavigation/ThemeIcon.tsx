import React from "react";
import { FaMoon, FaSun } from "react-icons/fa";
import useDarkMode from "../../hooks/useDarkMode";

const ThemeIcon = () => {
  const [darkTheme, setDarkTheme] = useDarkMode();
  const handleMode = () => setDarkTheme(!darkTheme);

  return (
    <span
      onClick={handleMode}
      className="theme-icon sidebar-icon relative flex items-center justify-center w-10 h-10"
    >
      {darkTheme ? (
        <FaSun size={24} className="text-primary" />
      ) : (
        <FaMoon size={24} className="text-primary" />
      )}
      <span className="sidebar-tooltip absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-100 scale-0">
        {darkTheme ? "Light Mode" : "Dark Mode"}
      </span>
    </span>
  );
};

export default ThemeIcon;
