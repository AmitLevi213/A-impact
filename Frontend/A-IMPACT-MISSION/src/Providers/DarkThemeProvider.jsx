/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

const themes = {
  light: {
    background: "#F5EFE7",
    color: "#213555",
    accent: "#3E5879",
    card: "#FFFFFF",
    border: "#D8C4B6",
  },
  dark: {
    background: "#213555",
    color: "#F5EFE7",
    accent: "#D8C4B6",
    card: "#3E5879",
    border: "#D8C4B6",
  },
};

export default function DarkThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.style.background = themes[theme].background;
    document.body.style.color = themes[theme].color;

    // inject CSS variables for global use
    document.documentElement.style.setProperty(
      "--accent-color",
      themes[theme].accent
    );
    document.documentElement.style.setProperty("--card-bg", themes[theme].card);
    document.documentElement.style.setProperty(
      "--border-color",
      themes[theme].border
    );
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, themeStyles: themes[theme] }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
