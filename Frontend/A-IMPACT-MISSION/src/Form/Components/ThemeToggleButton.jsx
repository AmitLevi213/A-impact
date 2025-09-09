import React, { useContext } from "react";
import { ThemeContext } from "../../Providers/DarkThemeProvider";

export default function ThemeToggleButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button
      style={{
        padding: "0.5em 1em",
        borderRadius: "2em",
        border: "none",
        background: theme === "dark" ? "#00bcd4" : "#0078d7",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        margin: "1em 0"
      }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="החלף מצב תאורה"
    >
      {theme === "dark" ? "☀️ מצב בהיר" : "🌙 מצב כהה"}
    </button>
  );
}
