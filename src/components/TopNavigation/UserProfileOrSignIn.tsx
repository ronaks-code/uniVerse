import React, { useState, useRef } from "react";
import { topNavClasses } from "./topNavClasses";
import { useAppSelector, useAppDispatch } from "../../hooks/storeHook";
import ProfileDropdown from "./ProfileDropdown"; // Import the Dropdown component
import { signInWithEmailAndPassword, signOut } from "firebase/auth"; // Import necessary Firebase auth functions
import { auth } from "../../services/firebase";
import { logout } from "../../features/authSlice";
import { PiSignIn } from "react-icons/pi";

const UserProfileOrSignIn = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null); // Define the ref type
  const dispatch = useAppDispatch();

  const toggleProfileDropdown = () => setProfileDropdownVisible(!profileDropdownVisible);
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

  return (
    <div className="relative">
      <button onClick={toggleProfileDropdown}>
        {user ? (
          <div className="sidebar-icon relative flex items-center justify-center w-10 h-10">
            {user?.photoUrl ? (
              <img
                className={`${topNavClasses.linkProfile} sidebar-icon transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
                src={user.photoUrl}
                alt="Avatar"
              />
            ) : (
              <div
                className={`sidebar-icon w-10 h-10 mb-0 text-2xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg transform transition-transform duration-300`}
              >
                {user?.email[0].toUpperCase()}
              </div>
            )}
          </div>
        ) : (
          <span
            className="sidebar-icon relative flex items-center justify-center w-10 h-10"
            onClick={handleSignIn} // Add this line to handle sign-in
          >
            <PiSignIn size="28" />
          </span>
        )}
      </button>

      {profileDropdownVisible && (
        <div ref={profileDropdownRef} className="absolute">
          <ProfileDropdown user={user} onSignOut={handleSignOut} onClose={() => setProfileDropdownVisible(false)} />
        </div>
      )}
    </div>
  );
};

export default UserProfileOrSignIn;

// const UserProfileOrSignIn = () => {
//   const { user } = useAppSelector((state) => state.auth);
//   if (user) {
//     return (
//       <Link to="/profile">
//         {user?.photoUrl ? (
//           <img
//             className={`${topNavClasses.linkProfile} transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
//             src={user.photoUrl}
//             alt="Avatar"
//           />
//         ) : (
//           <div
//             className={`sidebar-icon w-10 h-10 mb-0 text-2xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-xl`}
//           >
//             {user?.email[0].toUpperCase()}
//             <span className="sidebar-tooltip absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-100 scale-0">
//               Profile
//             </span>
//           </div>
//         )}
//       </Link>
//     );
//   } else {
//     return (
//       <Link
//         to="/auth"
//         className="sidebar-icon relative flex items-center justify-center w-10 h-10"
//       >
//         <PiSignIn size="28" />
//         <span className="sidebar-tooltip absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 opacity-0 transition-all duration-100 scale-0">
//           Sign In
//         </span>
//       </Link>
//     );
//   }
// };
