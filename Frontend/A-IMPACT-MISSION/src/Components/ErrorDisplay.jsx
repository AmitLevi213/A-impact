import React from "react";

export default function ErrorDisplay({ error }) {
  if (!error) return null;

  return (
    <div
      style={{
        color: "red",
        padding: "1rem",
        backgroundColor: "#ffe6e6",
        border: "1px solid #ffcccc",
        borderRadius: "0.5rem",
        marginTop: "1rem",
      }}
    >
      <strong>שגיאה:</strong> {error}
    </div>
  );
}
