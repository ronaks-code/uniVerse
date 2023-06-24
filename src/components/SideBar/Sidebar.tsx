import { Link } from 'react-router-dom';

import { headerClasses } from '../Header/headerClasses';
import { useAppSelector } from '../../hooks/storeHook';

import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo } from 'react-icons/fa';


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

  return (
    <div className="fixed top-0 left-0 h-screen w-16 flex flex-col
                  bg-white dark:bg-gray-900 shadow-lg">

      <Link to="/">
        <SideBarIcon icon={<FaFire size="28" />} />
      </Link>
      <Divider />
      {Boolean(!user) && (
        <Link to="/auth">
          Sign in
        </Link>
      )}
      {user ? (
        <Link to="/profile">
          {user?.photoUrl ? (
            <SideBarIcon icon={<img
              className={linkProfile}
              src={user.photoUrl}
              alt="Avatar"
            />} />
            // <img
            //   src={user.photoUrl}
            //   alt="Avatar"
            // />
          ) : (
            <div className="w-10 h-10 mb-0 text-2xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg">
              {user?.email[0].toUpperCase()}
            </div>
          )}
        </Link>
      ) : (
        <></>
      )}
      <SideBarIcon icon={<BsPlus size="32" />} />
      <SideBarIcon icon={<BsFillLightningFill size="20" />} />
      <SideBarIcon icon={<FaPoo size="20" />} />
      <Divider />
      <SideBarIcon icon={<BsGearFill size="22" />} />
    </div>
  );
};

const SideBarIcon = ({ icon, text = 'tooltip 💡' }: { icon: React.ReactNode; text?: string }) => (
  <div className="sidebar-icon group">
    {icon}

    <span className="sidebar-tooltip group-hover:scale-100">
      {text}
    </span>
  </div>
);


const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;