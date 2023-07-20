import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hooks/storeHook";

import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo, FaBars } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";

const transitionTime = "0.2s";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const { user } = useAppSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    setScrollPosition(scrollTop / (scrollHeight - clientHeight));
  };

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.maxHeight = isOpen
        ? `${sidebarRef.current.scrollHeight}px`
        : "55px";
    }
  }, [isOpen]);

  const renderUserProfile = () => {
    if (!user) {
      return (
        <Link
          to="/auth"
          style={{
            transition: `all ${transitionTime} ease-in-out ${
              isOpen ? (menuItems.length + 1) * 0.055 : 0.05
            }s`,
            transform: isOpen ? "translateX(0)" : "translateX(-120%)",
            // opacity: isOpen ? 1 : 0,
            visibility: isOpen ? "visible" : "hidden",
          }}
        >
          <SideBarItem
            icon={<PiSignIn size="28" />}
            text="Sign In"
            isOpen={isOpen}
          />
        </Link>
      );
    }

    return (
      <Link
        to="/profile"
        style={{
          transition: `all ${transitionTime} ease-in-out ${
            isOpen ? (menuItems.length + 1) * 0.05 : 0.05
          }s`,
          transform: isOpen ? "translateX(0)" : "translateX(-120%)",
          // opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {user?.photoUrl ? (
          <SideBarItem
            icon={
              <img
                className="w-9 h-9 p-1 rounded-full ring-2 ring-inset ring-current ring-gray-300"
                src={user.photoUrl}
                alt="Avatar"
              />
            }
            text="Profile"
            isOpen={isOpen}
          />
        ) : (
          <SideBarItem
            icon={
              <div
                className="w-9 h-9 m-3 rounded-full ring-2 ring-inset ring-current hover:ring-white hover:text-white text-2xl font-bold text-purple-600 grid place-content-center"
                style={{
                  backgroundImage: ``,
                  backgroundBlendMode: `multiply`,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {user?.email[0].toUpperCase()}
                </span>
              </div>
            }
            text="Profile"
            isOpen={isOpen}
          />
        )}
      </Link>
    );
  };

  const renderMenuItems = () => {
    return menuItems.map((item, index) => (
      <React.Fragment key={index}>
        <Link
          to={item.to}
          style={{
            transition: `all ${transitionTime} ease-in-out ${isOpen ? 0.05 * index : (menuItems.length + 1 - index) * 0.05}s`, // Updated transition time
            transform: isOpen ? "translateX(0)" : "translateX(-120%)", // New transform for expanding effect
          }}
        >
          <SideBarItem icon={item.icon} text={item.text} />
        </Link>
        {(index === 0 || index === 3) && (
          <Divider
            isOpen={isOpen}
            transitionDelay={
              isOpen ? (index + 1) * 0.05 + 0.025 : (menuItems.length + 1 - index) * 0.05 - 0.025
            }
          />
        )}
      </React.Fragment>
    ));
  };
  
  type MenuItem = {
    to: string;
    icon: React.ReactNode;
    text: string;
  };

  const menuItems: MenuItem[] = [
    {
      to: "/",
      icon: <FaFire size="28" />,
      text: "Home",
    },
    {
      to: "/course-service",
      icon: <BsFillLightningFill size="20" />,
      text: "Firebase",
    },
    {
      to: "/firebase-courses",
      icon: <BsPlus size="32" />,
      text: "Courses",
    },
    {
      to: "/JSON-courses",
      icon: <FaPoo size="20" />,
      text: "Course Cards",
    },
    {
      to: "/settings",
      icon: <BsGearFill size="22" />,
      text: "Settings",
    },
  ];

  return (
    <div className="absolute top-0 left-0 h-screen pt-4 pl-4 pb-4 pr-0 z-50 bg-transparent">
      {/* Sidebar menu */}
      <div
        className={`sidebar ${
          isOpen ? "shadow-lg shadow-purple-600 duration-700" : "shadow-lg shadow-purple-600 duration-700"
        } ${isOpen ? "rounded-full" : "rounded-full"}`}
        style={{
          transformOrigin: "center",
          width: "3.5rem",
        }}
        ref={sidebarRef}
        onScroll={handleScroll}
      >
        {/* Sidebar Icon */}
        <div
          className={`relative h-14 w-14 flex items-center justify-center bg-white dark:bg-gray-900 rounded-full`}
          onClick={toggleSidebar}
          style={{
            transition: `transform 0.3s`,
          }}
        >
          <div className="sidebar-icon">
            <SideBarItem
              icon={<FaBars size="20" />}
              text={isOpen ? "Close Sidebar" : "Open Sidebar"}
              isOpen={isOpen}
            />
          </div>
        </div>

        {/* Menu items and user profile... */}
        {renderMenuItems()}

        {/* Gradient Overlay */}
        {/* <div
          className="absolute top-0 left-0 right-0 h-full pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
            opacity: isOpen ? scrollPosition : 0,
            transition: `opacity ${transitionTime} linear`, // Added transition for opacity
          }}
        ></div> */}

        {renderUserProfile()}
      </div>
    </div>
  );
};

const SideBarItem = ({
  icon,
  text = "tooltip 💡",
  isOpen,
}: {
  icon: React.ReactNode;
  text?: string;
  isOpen?: boolean;
}) => (
  <div className="sidebar-icon group relative">
    {/* The following class name is commented out in index.css */}
    <div className="sidebar-icon-gradient">{icon}</div>

    <span
      className="sidebar-tooltip group-hover:scale-100"
      style={{
        transition: "transform ${transitionTime} ease-in-out",
      }}
    >
      {text}
    </span>
  </div>
);

const Divider = ({
  isOpen,
  transitionDelay,
}: {
  isOpen: boolean;
  transitionDelay: number;
}) => (
  <hr
    className="sidebar-hr"
    style={{
      transition: `all ${transitionTime} ease-in-out ${transitionDelay}s`,
      transform: isOpen ? "translateX(0)" : "translateX(-120%)",
      opacity: isOpen ? 1 : 0,
      // visibility: isOpen ? "visible" : "hidden",
    }}
  />
);

export default SideBar;
