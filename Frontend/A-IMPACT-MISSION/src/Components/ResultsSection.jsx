import React from "react";

export default function ResultsSection({ requirements, onClearResults }) {
  if (requirements.length === 0) return null;

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3>📋 דרישות רישוי לעסק שלך:</h3>
        <button
          onClick={onClearResults}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "0.25rem",
            cursor: "pointer",
            fontSize: "0.9rem",
          }}
        >
          נקה תוצאות
        </button>
      </div>
      <p>
        <strong>סה"כ נמצאו:</strong> {requirements.length} דרישות
      </p>

      {requirements.map((regulation, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            backgroundColor: "#f9f9f9",
            borderRadius: "0.5rem",
            border: "1px solid #e0e0e0",
          }}
        >
          <h4 style={{ color: "#2c3e50", marginBottom: "0.5rem" }}>
            {regulation.title || `דרישה ${idx + 1}`}
          </h4>

          <div style={{ marginBottom: "0.5rem" }}>
            <strong>קטגוריה:</strong> {regulation.category}
          </div>

          {regulation.content && (
            <div style={{ marginBottom: "0.5rem" }}>
              <strong>תוכן:</strong> {regulation.content.substring(0, 200)}...
            </div>
          )}

          {regulation.requirements && regulation.requirements.length > 0 && (
            <div>
              <strong>דרישות מפורטות:</strong>
              <ul style={{ marginTop: "0.5rem" }}>
                {regulation.requirements.map((req, reqIdx) => (
                  <li key={reqIdx} style={{ marginBottom: "0.25rem" }}>
                    <span
                      style={{
                        color:
                          req.type === "mandatory"
                            ? "#e74c3c"
                            : req.type === "forbidden"
                            ? "#c0392b"
                            : "#27ae60",
                        fontWeight: "bold",
                      }}
                    >
                      [
                      {req.type === "mandatory"
                        ? "חובה"
                        : req.type === "forbidden"
                        ? "אסור"
                        : req.type === "optional"
                        ? "אופציונלי"
                        : "כללי"}
                      ]
                    </span>{" "}
                    {req.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
