import { useEffect, useState } from "react";
import * as React from "react";
import { colorTheme } from "types";

interface ThemeContextType {
  color: colorTheme;
  isDark: boolean;
  toggleColor: () => void;
}
export const ThemeContext = React.createContext<ThemeContextType>(null!);

type ThemeProviderProps = {
  children: React.ReactNode;
};

const colorThemeStorageKey = "theme-preference";

function getColorPreference(): colorTheme {
  if (localStorage.getItem(colorThemeStorageKey)) {
    return localStorage.getItem(colorThemeStorageKey) as colorTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [color, setColor] = useState<colorTheme>(getColorPreference());

  useEffect(() => {
    function handleSystemColorChange({
      matches: isDark,
    }: {
      matches: boolean;
    }) {
      const newColor = isDark ? "dark" : "light";
      setColor(newColor);
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleSystemColorChange);

    return () =>
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleSystemColorChange);
  });

  useEffect(() => {
    if (color === "dark") {
      document.firstElementChild?.classList.add("pf-v6-theme-dark");
    } else {
      document.firstElementChild?.classList.remove("pf-v6-theme-dark");
    }
  }, [color]);

  return (
    <ThemeContext.Provider
      value={{
        color,
        isDark: color === "dark",
        toggleColor: () => {
          const newColor = color === "dark" ? "light" : "dark";
          localStorage.setItem(colorThemeStorageKey, newColor);
          setColor(newColor);
        },
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return React.useContext(ThemeContext);
}
