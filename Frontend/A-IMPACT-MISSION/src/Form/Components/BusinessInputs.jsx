import React, { useContext } from "react";
import { ThemeContext } from "../../Providers/DarkThemeProvider";

export default function BusinessInputs({
  size,
  setSize,
  seating,
  setSeating,
  gas,
  setGas,
  delivery,
  setDelivery,
}) {
  const { themeStyles } = useContext(ThemeContext);
  const inputStyle = {
    background: themeStyles.card,
    color: themeStyles.color,
    border: `1px solid ${themeStyles.border}`,
    padding: "0.5em",
    borderRadius: "0.5em",
    fontSize: "1em",
    marginBottom: "0.5em",
  };
  return (
    <>
      <label>
        גודל העסק (מ"ר):
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          required
          min="1"
          step="0.1"
          style={inputStyle}
        />
      </label>
      <br />
      <label>
        מספר מקומות ישיבה/תפוסה:
        <input
          type="number"
          value={seating}
          onChange={(e) => setSeating(e.target.value)}
          required
          min="1"
          step="1"
          style={inputStyle}
        />
      </label>
      <br />
      <label>
        שימוש בגז:
        <input
          type="checkbox"
          checked={gas}
          onChange={(e) => setGas(e.target.checked)}
          style={{ accentColor: themeStyles.accent }}
        />
      </label>
      <br />
      <label>
        משלוחים:
        <input
          type="checkbox"
          checked={delivery}
          onChange={(e) => setDelivery(e.target.checked)}
          style={{ accentColor: themeStyles.accent }}
        />
      </label>
      <br />
    </>
  );
}
