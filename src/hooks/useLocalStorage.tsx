import { useState, Dispatch, SetStateAction, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Attempt to retrieve and parse the stored value
  let initial: T;
  const storedValue = localStorage.getItem(key);
  try {
    initial = storedValue ? JSON.parse(storedValue) : initialValue;
  } catch (error) {
    console.error("Error parsing stored JSON for key:", key, error);
    initial = initialValue;
  }

  const [value, setValue] = useState<T>(initial);

  const setStoredValue: Dispatch<SetStateAction<T>> = (newValue) => {
    if (typeof newValue === "function") {
      // Handle functional updates
      setValue((prevValue) => (newValue as (prev: T) => T)(prevValue));
    } else {
      setValue(newValue);
    }
  };

  // useEffect to synchronize the state value with localStorage
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setStoredValue];
}

export default useLocalStorage;
