import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../../Providers/DarkThemeProvider";

export default function SubmitButton({ 
  loading = false, 
  canSubmit = true, 
  remainingCooldown = 0 
}) {
  const { themeStyles } = useContext(ThemeContext);
  const [displayCooldown, setDisplayCooldown] = useState(remainingCooldown);

  // Update cooldown display every second
  useEffect(() => {
    if (remainingCooldown > 0) {
      const timer = setInterval(() => {
        setDisplayCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    } else {
      setDisplayCooldown(0);
    }
  }, [remainingCooldown]);

  const isDisabled = loading || !canSubmit || displayCooldown > 0;

  return (
    <div style={{ textAlign: "center" }}>
      <button
        type="submit"
        disabled={isDisabled}
        style={{
          padding: "0.7em 1.5em",
          borderRadius: "2em",
          border: "none",
          background: isDisabled ? "#ccc" : themeStyles.accent,
          color: themeStyles.card,
          fontWeight: "bold",
          cursor: isDisabled ? "not-allowed" : "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          marginTop: "1em",
          transition: "background 0.2s",
          opacity: isDisabled ? 0.7 : 1,
          minWidth: "120px",
        }}
      >
        {loading 
          ? "מעבד..." 
          : displayCooldown > 0 
            ? `המתן ${displayCooldown}ש`
            : "שלח"
        }
      </button>
      {displayCooldown > 0 && (
        <div style={{
          marginTop: "0.5rem",
          fontSize: "0.9rem",
          color: themeStyles.color,
          opacity: 0.7
        }}>
          הגנה מפני שליחות מרובות
        </div>
      )}
    </div>
  );
}
