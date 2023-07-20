import React from "react";
import { Link } from "react-router-dom";
import { BsGearFill } from "react-icons/bs";
import settingsClasses from "./settingsClasses";

const SettingsSidebar = () => {
  return (
    <div className="flex">
      {/* Dark Background */}
      <div className=""></div>

      {/* Sidebar */}
      <div className={settingsClasses.sidebarContainer}>
        {/* Sidebar Header */}
        <div className={settingsClasses.sidebarHeader}>
          <Link to="/" className={settingsClasses.sidebarHeaderLink}>
            <BsGearFill />
          </Link>
        </div>

        {/* Sidebar Menu */}
        <nav className={settingsClasses.sidebarMenu}>
          {/* Your Account */}
          <Link
            to="/settings/account"
            className={`${settingsClasses.sidebarMenuItem}`}
          >
            Your Account
          </Link>

          {/* Privacy & Safety */}
          <Link
            to="/settings/privacy-safety"
            className={`${settingsClasses.sidebarMenuItem}`}
          >
            Privacy & Safety
          </Link>

          {/* Appearance */}
          <Link
            to="/settings/appearance"
            className={`${settingsClasses.sidebarMenuItem}`}
          >
            Appearance
          </Link>

          {/* Notifications */}
          <Link
            to="/settings/notifications"
            className={`${settingsClasses.sidebarMenuItem}`}
          >
            Notifications
          </Link>

          {/* Add more sections as needed */}
        </nav>

        {/* Sidebar Footer (Optional) */}
        <div className={`${settingsClasses.sidebarFooter}`}>
          © 2023 Your App Name. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;
