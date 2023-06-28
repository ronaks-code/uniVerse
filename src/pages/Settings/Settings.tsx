import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { settingsClasses } from './settingsClasses';
import SideBar from '../../components/SideBar/Sidebar';

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
    zoomInAnimation,
    zoomOutAnimation,
  } = settingsClasses;

  const [transitionClass, setTransitionClass] = useState('');

  useEffect(() => {
    if (location.state && location.state.prevLocation) {
      setTransitionClass(zoomInAnimation);
    } else {
      setTransitionClass(zoomOutAnimation);
    }
  }, [location.state, zoomInAnimation, zoomOutAnimation]);

  const handleBackButtonClick = () => {
    navigate(-1);
  };

  return (
    <>
      <SideBar />
      <div className={`${page} ${transitionClass}`}>
        <h1 className={title}>
          <button className="text-blue-500 hover:underline" onClick={handleBackButtonClick}>
            Back
          </button>{' '}
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
    </>
  );
};

export default SettingsPage;
