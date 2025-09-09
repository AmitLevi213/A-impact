import { useContext } from "react";
import { ThemeContext } from "../../Providers/DarkThemeProvider";

export default function SubmitButton() {
  const { themeStyles } = useContext(ThemeContext);
  return (
    <button
      type="submit"
      style={{
        padding: "0.7em 1.5em",
        borderRadius: "2em",
        border: "none",
        background: themeStyles.accent,
        color: themeStyles.card,
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginTop: "1em",
        transition: "background 0.2s",
      }}
    >
      שלח
    </button>
  );
}
