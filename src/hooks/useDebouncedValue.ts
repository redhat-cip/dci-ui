import { useState, useEffect } from "react";

export function useDebouncedValue<T>(input: T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(input);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(input);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [input, delay]);

  return debouncedValue;
}
