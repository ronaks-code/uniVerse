import React from "react";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const HomeButton = () => {
  const navigate = useNavigate(); // Get the navigate function

  // Define a function to handle the click event
  const handleClick = () => {
    navigate("/"); // Navigate to the home route
  };

  return (
    <div className="relative sidebar-icon flex items-center justify-center w-10 h-10" onClick={handleClick}>
      <AiFillHome size={24} className="text-primary" />
      <span className="sidebar-tooltip absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-100 scale-0">
        Home
      </span>
    </div>
  );
};

export default HomeButton;
