import React from 'react';
import { Link } from 'react-router-dom';
import { settingsClasses } from './settingsClasses';

const SettingsPage: React.FC = () => {
  const {
    page,
    title,
    container,
    section,
    sectionTitle,
    option,
    optionLabel,
    toggle,
    slider,
    input,
    button,
  } = settingsClasses;

  return (
    <div className={page}>
      <h1 className={title}>
        <Link to="/" className="text-blue-500 hover:underline">
          Back
        </Link>{' '}
        Settings
      </h1>
      <div className={container}>
        <div className={section}>
          <h2 className={sectionTitle}>General</h2>
          <div className={option}>
            <span className={optionLabel}>Dark Mode</span>
            <label className={toggle}>
              <input type="checkbox" />
              <span className={slider}></span>
            </label>
          </div>
          <div className={option}>
            <span className={optionLabel}>Notifications</span>
            <label className={toggle}>
              <input type="checkbox" />
              <span className={slider}></span>
            </label>
          </div>
        </div>

        <div className={section}>
          <h2 className={sectionTitle}>Profile</h2>
          <div className={option}>
            <span className={optionLabel}>Username</span>
            <input type="text" className={input} />
          </div>
          <div className={option}>
            <span className={optionLabel}>Email</span>
            <input type="email" className={input} />
          </div>
        </div>

        <div className={section}>
          <h2 className={sectionTitle}>Security</h2>
          <div className={option}>
            <span className={optionLabel}>Change Password</span>
            <button className={button}>Change</button>
          </div>
          <div className={option}>
            <span className={optionLabel}>Two-Factor Authentication</span>
            <label className={toggle}>
              <input type="checkbox" />
              <span className={slider}></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
