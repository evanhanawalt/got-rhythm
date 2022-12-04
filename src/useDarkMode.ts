import { useEffect, useState } from "react";

export const useDarkMode = () => {
  useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    }
  }, []);
  const [isDark, setIsDark] = useState(localStorage.theme === "dark");

  const setDarkMode = () => {
    setIsDark(true);
    localStorage.theme = "dark";
    document.documentElement.classList.add("dark");
  };
  const setLightMode = () => {
    setIsDark(false);
    localStorage.theme = "light";
    document.documentElement.classList.remove("dark");
  };
  return { darkMode: isDark, setDarkMode, setLightMode };
};
