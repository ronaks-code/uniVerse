import { useState, Dispatch, SetStateAction } from "react";

function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;

  const [value, setValue] = useState<T>(initial);

  const setStoredValue: Dispatch<SetStateAction<T>> = (newValue) => {
    if (typeof newValue === "function") {
      // Handle functional updates
      setValue((prev) => {
        const result = (newValue as Function)(prev);
        localStorage.setItem(key, JSON.stringify(result));
        return result;
      });
    } else {
      setValue(newValue);
      localStorage.setItem(key, JSON.stringify(newValue));
    }
  };

  return [value, setStoredValue];
}

export default useLocalStorage;
