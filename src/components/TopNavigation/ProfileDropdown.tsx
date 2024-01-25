import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation

// Define an interface for the props
interface ProfileDropdownProps {
  user: any; // This type can be more specific based on your user object's structure
  onSignOut: () => void; // This is a function that returns void (doesn't return anything)
  onClose: () => void; // Callback to close the dropdown
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ user, onSignOut, onClose }) => {
  // State to track whether the dropdown is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the dropdown
  const toggleProfileDropdown = () => {
    setIsOpen(!isOpen);
    onClose(); // Call the onClose callback to close the dropdown
  };

  return (
    <div className="bg-white shadow-md mt-2 rounded-lg w-64">
      {!user ? (
        <div>
          {/* Use Link to navigate to the authentication page */}
          <Link
            to="/auth"
            onClick={toggleProfileDropdown} // Close the dropdown when Sign In is clicked
            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <button
          onClick={() => {
            onSignOut();
            toggleProfileDropdown(); // Close the dropdown when the button is clicked
          }}
          className="block w-full text-left px-4 py-2 hover:bg-gray-200"
        >
          Sign Out
        </button>
      )}
    </div>
  );
};

export default ProfileDropdown;
