import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FirebaseContext } from "../../context/FirebaseContext";

// Update the ProfileDropdownProps interface to reflect the possible absence of a user
interface ProfileDropdownProps {
  user: any;
  onSignOut: () => void;
  onClose: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onSignOut,
  onClose,
}) => {
  // Check if a user is signed in

  let userFb = useContext(FirebaseContext)?.user || user;
  let userEmail = userFb?.email;
  let userSignInMethod = userFb?.signInMethod;

  const isSignedIn = userFb !== null || user !== null;

  return (
    <div className="py-1">
      {isSignedIn ? (
        <>
          <div className="px-4 py-2 text-sm text-gray-700">
            Signed in as: <br />
            <strong>{userEmail}</strong> <br />
            {/* {userEmail} <br /> */}
            via {userSignInMethod}
          </div>
          <div className="border-t border-gray-100"></div>
          <button
            onClick={() => {
              onSignOut();
              onClose(); // Close the dropdown when the button is clicked
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </>
      ) : (
        <>
          <div className="px-4 py-2 text-sm text-gray-700">
            You are not signed in.
          </div>
          <Link
            to="/auth"
            onClick={onClose} // Close the dropdown when Sign In is clicked
            className="block w-full text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign In
          </Link>
        </>
      )}
    </div>
  );
};

export default ProfileDropdown;
