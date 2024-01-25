import React, { createContext, useContext } from 'react';
import useDarkMode from './useDarkMode';

const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
  const [enabled, setEnabled] = useDarkMode();

  return (
    <DarkModeContext.Provider value={{ enabled, setEnabled }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkModeState = () => {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkModeState must be used within a DarkModeProvider');
  }
  return context;
};
