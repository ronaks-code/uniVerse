import React, { useState, useEffect, useRef, forwardRef } from "react";
import { topNavClasses } from "./topNavClasses";
import { useAppSelector, useAppDispatch } from "../../hooks/storeHook";
import ProfileDropdown from "./ProfileDropdown"; // Import the Dropdown component
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // Import necessary Firebase auth functions
import { auth } from "../../services/firebase";
import { logout } from "../../features/authSlice";
import { PiSignIn } from "react-icons/pi";
import { FirebaseContext } from "../../context/FirebaseContext";

const UserProfileOrSignIn = forwardRef<HTMLDivElement>((props, ref) => {
  const { user } = useAppSelector((state) => state.auth);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null); // Add this line
  const dispatch = useAppDispatch();

  const toggleProfileDropdown = () =>
    setProfileDropdownVisible(!profileDropdownVisible);
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user using Firebase auth
      dispatch(logout()); // Dispatch a logout action (you should define this action in your Redux slice)
    } catch (error) {
      console.error("Error signing out:", error);
    }
    setProfileDropdownVisible(false);
  };

  const handleSignIn = async () => {
    // Implement your sign-in logic here using Firebase
    // Example: You can show a sign-in modal or navigate to the sign-in page
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownVisible]);

  return (
    <div ref={ref} className="relative">
      <button
        ref={toggleButtonRef}
        onClick={toggleProfileDropdown}
        className="flex items-center justify-center w-10 h-10"
      >
        {user ? (
          <div className="sidebar-icon">
            {user?.photoUrl ? (
              <img
                className={`${topNavClasses.linkProfile} rounded-full transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
                src={user.photoUrl}
                alt="Avatar"
              />
            ) : (
              <div
                className={`w-10 h-10 text-2xl font-bold flex items-center justify-center bg-green-200 rounded-full shadow-lg transform transition-transform duration-300`}
              >
                {user?.email[0].toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <span className="sidebar-icon" onClick={handleSignIn}>
            <PiSignIn size="28" />
          </span>
        )}
      </button>

      {profileDropdownVisible && (
        <div
          ref={profileDropdownRef}
          className="absolute right-0 z-50 w-52 bg-white rounded-md shadow-lg mt-2"
        >
          <ProfileDropdown
            user={user}
            onSignOut={handleSignOut}
            onClose={() => setProfileDropdownVisible(false)}
          />
        </div>
      )}
    </div>
  );
});

export default UserProfileOrSignIn;
