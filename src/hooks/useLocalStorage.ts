import { useState } from "react";
import { readValue, saveValue } from "services/localStorage";

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  version: number = 1
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(
    readValue(key, initialValue, version)
  );
  return [
    storedValue,
    (value: T) => {
      saveValue(key, value, version);
      setStoredValue(value);
    },
  ];
}
