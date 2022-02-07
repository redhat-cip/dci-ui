import { useEffect, useState } from "react";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  version: number = 1
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(readValue);
  function readValue() {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        const { value, version: localStorageVersion } = JSON.parse(item);
        return localStorageVersion === version ? value : initialValue;
      }
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key “${key}”:`, error);
      return initialValue;
    }
  }
  function setValue(value: T) {
    try {
      window.localStorage.setItem(key, JSON.stringify({ version, value }));
      setStoredValue(value);
    } catch (error) {
      console.warn(`Error setting localStorage key “${key}”:`, error);
    }
  }
  useEffect(() => {
    setStoredValue(readValue());
    // eslint-disable-next-line
  }, []);
  return [storedValue, setValue];
}
