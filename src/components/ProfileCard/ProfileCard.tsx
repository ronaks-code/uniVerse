import { Dispatch, FC, SetStateAction } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { User } from "../../models/User";

import {
  FaSearch,
  FaHashtag,
  FaRegBell,
  FaUserCircle,
  FaMoon,
  FaSun,
} from 'react-icons/fa';
import useDarkMode from '../../hooks/useDarkMode';

import { themeIconClasses } from './ThemeIconClasses';

interface ProfileCardProps {
  handleLogout: () => Promise<void>;
  user: User;
  setResetPassword: () => void;
}

const ProfileCard: FC<ProfileCardProps> = (props) => {
  const {
    handleLogout,
    user: { photoUrl, email },
    setResetPassword,
  } = props;

  const [darkTheme, setDarkTheme] = useDarkMode();
  const { themeIconOutline, themeIcon } = themeIconClasses;

  const ThemeIcon = () => {
    const handleMode = () => setDarkTheme(!darkTheme);
    return (
      <span onClick={handleMode} className={themeIconOutline}>
        <div className={themeIcon}>
          {darkTheme ? (
            <FaSun size='24' className='top-navigation-icon' /> // Updated color to white for dark mode
          ) : (
            <FaMoon size='24' className='top-navigation-icon' /> // Updated color to gray for light mode
          )}
        </div>
      </span>
    );
  };

  return (
    <div className={`w-screen h-[100vh] flex items-center justify-center ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}> 
      <div className={`w-full p-4 max-w-sm border rounded-lg shadow ${darkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}> 
        <div className="flex flex-col items-center pb-10">
          {photoUrl ? (
            <img
              className="w-24 h-24 mb-3 object-cover rounded-full shadow-lg"
              src={photoUrl}
              alt="Avatar"
            />
          ) : (
            <div className={`w-24 h-24 mb-3 text-4xl font-bold grid place-content-center rounded-full shadow-lg ${darkTheme ? 'bg-green-600' : 'bg-green-200'}`}> 
              {email[0].toUpperCase()}
            </div>
          )}
          <span className={`text-sm ${darkTheme ? 'text-gray-200' : 'text-gray-500'}`}>{email}</span> {/* Updated text color based on darkTheme */}
          <div className={`flex mt-4 space-x-3 md:mt-6 ${darkTheme ? 'text-white' : 'text-gray-900'}`}> {/* Updated text color based on darkTheme */}
            <button
              type="button"
              onClick={setResetPassword}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center rounded-lg ${darkTheme ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-300' : 'bg-blue-700 hover:bg-blue-800 focus:ring-blue-300 text-white'}`}
            >
              Change Password
            </button>
            <button
              onClick={handleLogout}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium text-center rounded-lg ${darkTheme ? 'bg-gray-800 hover:bg-gray-700 focus:ring-gray-200' : 'bg-white border border-gray-300 hover:bg-gray-100 focus:ring-gray-200 text-gray-900'}`} 
            >
              Logout
            </button>
          </div>
          <ThemeIcon />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
