import { useEffect, useState } from "react";

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const storedValue = item ? JSON.parse(item) : initialValue;

      // Apply the dark mode class directly during initialization
      const className = "dark";
      const bodyClass = window.document.body.classList;
      storedValue ? bodyClass.add(className) : bodyClass.remove(className);

      return storedValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };
  return [storedValue, setValue];
};

const useDarkMode = () => {
  const [enabled, setEnabled] = useLocalStorage("dark-theme", false);

  useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;

    enabled ? bodyClass.add(className) : bodyClass.remove(className);

    // No cleanup function required
  }, [enabled]);

  return [enabled, setEnabled];
};

export default useDarkMode;
