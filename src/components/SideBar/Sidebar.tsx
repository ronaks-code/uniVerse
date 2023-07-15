import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import { useAppSelector } from "../../hooks/storeHook";

import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo, FaBars } from "react-icons/fa";
import { PiSignIn } from "react-icons/pi";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);
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
    if (gradientRef.current) {
      gradientRef.current.style.opacity = `${scrollPosition}`;
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.maxHeight = isOpen
        ? `${sidebarRef.current.scrollHeight}px`
        : "0";
    }
  }, [isOpen]);

  const renderUserProfile = () => {
    if (!user) {
      return (
        <Link
          to="/auth"
          style={{
            transition: `all 0.1s ease ${
              isOpen ? (menuItems.length + 1) * 0.1 - 0.15 : 0.05
            }s`,
            transform: isOpen ? "translateY(0)" : "translateY(-20px)",
            opacity: isOpen ? 1 : 0,
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
        to={isOpen ? "/profile" : window.location.pathname}
        onClick={(event) => event.preventDefault()}
        style={{
          transition: `all 0.1s ease ${
            isOpen ? (menuItems.length + 1) * 0.1 - 0.15 : 0.05
          }s`,
          transform: isOpen ? "translateY(0)" : "translateY(-20px)",
          opacity: isOpen ? 1 : 0,
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
            transition: `all 0.1s ease ${
              isOpen
                ? index * 0.05 + 0.05
                : (menuItems.length - index) * 0.05 + 0.05
            }s`,
            transform: isOpen ? "translateY(0)" : "translateY(-20px)",
            opacity: isOpen ? 1 : 0,
          }}
        >
          <SideBarItem icon={item.icon} text={item.text} />
        </Link>
        {(index === 0 || index === 3) && (
          <Divider
            isOpen={isOpen}
            index={index}
            transitionDelay={
              isOpen ? (index + 1) * 0.05 + 0.05 : (index + 1) * 0.05 + 0.05
            }
            menuItems={menuItems}
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
      to: isOpen ? "/" : window.location.pathname,
      icon: <FaFire size="28" />,
      text: "Home",
    },
    {
      to: isOpen ? "/course-service" : window.location.pathname,
      icon: <BsFillLightningFill size="20" />,
      text: "Firebase",
    },
    {
      to: isOpen ? "/firebase-courses" : window.location.pathname,
      icon: <BsPlus size="32" />,
      text: "Courses",
    },
    {
      to: isOpen ? "/JSON-courses" : window.location.pathname,
      icon: <FaPoo size="20" />,
      text: "Course Cards",
    },
    {
      to: isOpen ? "/settings" : window.location.pathname,
      icon: <BsGearFill size="22" />,
      text: "Settings",
    },
  ];

  return (
    <div className="absolute top-0 left-0 h-screen pt-4 pl-4 pb-4 pr-0 z-50 bg-transparent">
      {/* Sidebar menu */}
      <div
        className={`sidebar ${
          isOpen ? "duration-700" : "shadow-lg duration-700"
        } ${isOpen ? "rounded-full" : "rounded-full"}`}
        style={{
          transformOrigin: "center",
          width: "3.5rem",
        }}
        ref={sidebarRef}
        onScroll={handleScroll}
      >
        {/* Sidebar Content */}
        <div className="w-full relative">
          {/* Sidebar Icon */}
          <div
            className={`relative h-14 w-14 flex items-center justify-center bg-white dark:bg-gray-900 ${
              isOpen ? "rounded-full" : "rounded-full"
            }`}
            onClick={toggleSidebar}
            style={{
              transition: isOpen
                ? "border-radius 0.2s ease"
                : "border-radius 1s ease",
            }}
          >
            <div
              className={`sidebar-icon group ${
                isOpen ? "rounded-full" : "rounded-full"
              }`}
            >
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
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)",
              opacity: 0,
            }}
            ref={gradientRef}
          ></div> */}

          {renderUserProfile()}
        </div>
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
        transition: "transform 0.1s ease",
      }}
    >
      {text}
    </span>
  </div>
);

const Divider = ({
  isOpen,
  index,
  transitionDelay,
  menuItems,
}: {
  isOpen: boolean;
  index: number;
  transitionDelay: number;
  menuItems: any;
}) => (
  <hr
    className="sidebar-hr"
    style={{
      transition: `all 0.1s ease ${
        isOpen ? transitionDelay : (menuItems.length - index) * 0.05 + 0.05
      }s`,
      transform: isOpen ? "translateY(0)" : "translateY(-10px)",
      opacity: isOpen ? 1 : 0,
    }}
  />
);

export default SideBar;
