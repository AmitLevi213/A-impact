/* eslint-disable react-refresh/only-export-components */
import  { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const themes = {
  light: {
    background: "#f5f6fa",
    color: "#222",
    accent: "#0078d7",
    card: "#fff",
    border: "#e0e0e0"
  },
  dark: {
    background: "#181a20",
    color: "#f5f6fa",
    accent: "#00bcd4",
    card: "#23272f",
    border: "#333"
  }
};

export default function DarkThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.background = themes[theme].background;
    document.body.style.color = themes[theme].color;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeStyles: themes[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}
