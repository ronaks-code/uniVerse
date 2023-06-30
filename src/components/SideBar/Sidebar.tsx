import { Link } from "react-router-dom";

import { headerClasses } from "../Header/headerClasses";
import { useAppSelector } from "../../hooks/storeHook";

import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";
// import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const SideBar = () => {
  const {
    header,
    navContainer,
    navContent,
    linkHome,
    linkProfile,
    linkSignIn,
  } = headerClasses;

  const { user } = useAppSelector((state) => state.auth);

  const renderUserProfile = () => {
    if (!user) {
      return (
        <Link to="/auth">
          <SideBarIcon icon={<PiSignIn size="28" />} text="Sign In" />
        </Link> 
      );
    }

    return (
      <Link to="/profile">
        {user?.photoUrl ? (
          <SideBarIcon
            icon={
              <img className={linkProfile} src={user.photoUrl} alt="Avatar" />
            }
            text="Profile"
          />
        ) : (
          <div className="w-11 h-11 m-3 ml-2.5 text-2xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg">
            {user?.email[0].toUpperCase()}
          </div>
        )}
      </Link>
    );
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
      <Link to="/">
        <SideBarIcon icon={<FaFire size="28" />} text="Home" />
      </Link>

      <Divider />

      <Link to="/course-service">
        <SideBarIcon icon={<BsFillLightningFill size="20" />} text="Firebase" />
      </Link>

      <Link to="/firebase-courses">
        <SideBarIcon icon={<BsPlus size="32" />} />
      </Link>

      <Link to="/JSON-courses">
        <SideBarIcon icon={<FaPoo size="20" />} text="Course Cards" />
      </Link>

      <Divider />

      {renderUserProfile()}

      <Link to="/settings">
        <SideBarIcon icon={<BsGearFill size="22" />} text="Settings" />
      </Link>
    </div>
  );
};

const SideBarIcon = ({
  icon,
  text = "tooltip 💡",
}: {
  icon: React.ReactNode;
  text?: string;
}) => (
  <div className="sidebar-icon group">
    {icon}

    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
