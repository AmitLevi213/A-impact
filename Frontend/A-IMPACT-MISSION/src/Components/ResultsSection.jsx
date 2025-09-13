import React, { useState } from "react";
import { useTheme } from "../Providers/DarkThemeProvider";

export default function ResultsSection({ requirements, aiReport, onClearResults }) {
  const { themeStyles } = useTheme();
  const [activeTab, setActiveTab] = useState("report");

  if (requirements.length === 0 && !aiReport) return null;

  const formatReportText = (text) => {
    if (!text) return "";
    
    // Split by double newlines to create sections
    const sections = text.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      const trimmedSection = section.trim();
      
      // Check if this is a header (starts with ** or contains specific keywords)
      if (trimmedSection.includes('**') || 
          trimmedSection.includes('סיכום כללי') ||
          trimmedSection.includes('דרישות לפי קטגוריות') ||
          trimmedSection.includes('המלצות פעולה') ||
          trimmedSection.includes('טיפים חשובים')) {
        return (
          <h3 key={index} style={{
            color: themeStyles.accent,
            marginTop: index > 0 ? '1.5rem' : '0',
            marginBottom: '1rem',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            borderBottom: `2px solid ${themeStyles.border}`,
            paddingBottom: '0.5rem'
          }}>
            {trimmedSection.replace(/\*\*/g, '')}
          </h3>
        );
      }
      
      // Check if this is a bullet point section
      if (trimmedSection.includes('- ') || trimmedSection.includes('• ')) {
        const lines = trimmedSection.split('\n');
        return (
          <div key={index} style={{ marginBottom: '1rem' }}>
            {lines.map((line, lineIndex) => {
              if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
                return (
                  <div key={lineIndex} style={{
                    marginLeft: '1rem',
                    marginBottom: '0.5rem',
                    paddingLeft: '0.5rem',
                    borderLeft: `3px solid ${themeStyles.accent}`,
                    backgroundColor: themeStyles.background === '#F5EFE7' ? '#f8f9fa' : '#2a3d5a',
                    padding: '0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    {line.replace(/^[-•]\s*/, '')}
                  </div>
                );
              }
              return null;
            })}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <p key={index} style={{
          marginBottom: '1rem',
          lineHeight: '1.6',
          textAlign: 'right'
        }}>
          {trimmedSection}
        </p>
      );
    });
  };

  return (
    <div
      style={{
        marginTop: "2rem",
        padding: "1.5rem",
        border: `2px solid ${themeStyles.border}`,
        borderRadius: "1rem",
        backgroundColor: themeStyles.card,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem"
        }}
      >
        <h2 style={{ 
          color: themeStyles.accent, 
          margin: 0,
          fontSize: "1.5rem",
          fontWeight: "bold"
        }}>
          📋 תוצאות הבדיקה
        </h2>
        <button
          onClick={onClearResults}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            transition: "background-color 0.2s",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#c0392b"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#e74c3c"}
        >
          נקה תוצאות
        </button>
      </div>

      {/* Summary Stats */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap"
        }}
      >
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: themeStyles.background === '#F5EFE7' ? '#e8f4f8' : '#1e2a3a',
            borderRadius: "0.5rem",
            border: `1px solid ${themeStyles.border}`,
            flex: "1",
            minWidth: "150px"
          }}
        >
          <div style={{ fontWeight: "bold", color: themeStyles.accent, marginBottom: "0.25rem" }}>
            סה"כ דרישות
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {requirements.length}
          </div>
        </div>
        <div
          style={{
            padding: "0.75rem 1rem",
            backgroundColor: themeStyles.background === '#F5EFE7' ? '#e8f5e8' : '#1e3a2a',
            borderRadius: "0.5rem",
            border: `1px solid ${themeStyles.border}`,
            flex: "1",
            minWidth: "150px"
          }}
        >
          <div style={{ fontWeight: "bold", color: themeStyles.accent, marginBottom: "0.25rem" }}>
            דוח AI
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            {aiReport ? "✅" : "❌"}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div
        style={{
          display: "flex",
          borderBottom: `2px solid ${themeStyles.border}`,
          marginBottom: "1.5rem"
        }}
      >
        <button
          onClick={() => setActiveTab("report")}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            backgroundColor: activeTab === "report" ? themeStyles.accent : "transparent",
            color: activeTab === "report" ? themeStyles.card : themeStyles.color,
            cursor: "pointer",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "bold",
            transition: "all 0.2s",
            marginRight: "0.5rem"
          }}
        >
          🤖 דוח AI מפורט
        </button>
        <button
          onClick={() => setActiveTab("regulations")}
          style={{
            padding: "0.75rem 1.5rem",
            border: "none",
            backgroundColor: activeTab === "regulations" ? themeStyles.accent : "transparent",
            color: activeTab === "regulations" ? themeStyles.card : themeStyles.color,
            cursor: "pointer",
            borderRadius: "0.5rem 0.5rem 0 0",
            fontWeight: "bold",
            transition: "all 0.2s"
          }}
        >
          📜 דרישות מפורטות
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ minHeight: "300px" }}>
        {activeTab === "report" && aiReport ? (
          <div
            style={{
              backgroundColor: themeStyles.background === '#F5EFE7' ? '#f8f9fa' : '#2a3d5a',
              padding: "1.5rem",
              borderRadius: "0.5rem",
              border: `1px solid ${themeStyles.border}`,
              lineHeight: "1.6"
            }}
          >
            {formatReportText(aiReport)}
          </div>
        ) : activeTab === "report" && !aiReport ? (
          <div
            style={{
              textAlign: "center",
              padding: "3rem",
              color: themeStyles.color,
              opacity: 0.7
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
            <div>דוח AI לא זמין כרגע</div>
          </div>
        ) : (
          <div>
            {requirements.map((regulation, idx) => (
              <div
                key={idx}
                style={{
                  marginBottom: "1.5rem",
                  padding: "1.5rem",
                  backgroundColor: themeStyles.background === '#F5EFE7' ? '#f8f9fa' : '#2a3d5a',
                  borderRadius: "0.75rem",
                  border: `1px solid ${themeStyles.border}`,
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)"
                }}
              >
                <h4 style={{ 
                  color: themeStyles.accent, 
                  marginBottom: "0.75rem",
                  fontSize: "1.1rem",
                  fontWeight: "bold"
                }}>
                  {regulation.title || `דרישה ${idx + 1}`}
                </h4>

                <div style={{ 
                  marginBottom: "0.75rem",
                  padding: "0.5rem",
                  backgroundColor: themeStyles.card,
                  borderRadius: "0.25rem",
                  border: `1px solid ${themeStyles.border}`
                }}>
                  <strong>קטגוריה:</strong> {regulation.category}
                </div>

                {regulation.content && (
                  <div style={{ marginBottom: "0.75rem" }}>
                    <strong>תוכן:</strong>
                    <div style={{
                      marginTop: "0.5rem",
                      padding: "0.75rem",
                      backgroundColor: themeStyles.background === '#F5EFE7' ? '#ffffff' : '#1e2a3a',
                      borderRadius: "0.25rem",
                      border: `1px solid ${themeStyles.border}`,
                      lineHeight: "1.5"
                    }}>
                      {regulation.content.substring(0, 300)}
                      {regulation.content.length > 300 && "..."}
                    </div>
                  </div>
                )}

                {regulation.requirements && regulation.requirements.length > 0 && (
                  <div>
                    <strong>דרישות מפורטות:</strong>
                    <div style={{ marginTop: "0.75rem" }}>
                      {regulation.requirements.map((req, reqIdx) => (
                        <div
                          key={reqIdx}
                          style={{
                            marginBottom: "0.5rem",
                            padding: "0.75rem",
                            backgroundColor: themeStyles.background === '#F5EFE7' ? '#ffffff' : '#1e2a3a',
                            borderRadius: "0.25rem",
                            border: `1px solid ${themeStyles.border}`,
                            borderLeft: `4px solid ${
                              req.type === "mandatory"
                                ? "#e74c3c"
                                : req.type === "forbidden"
                                ? "#c0392b"
                                : "#27ae60"
                            }`
                          }}
                        >
                          <span
                            style={{
                              color:
                                req.type === "mandatory"
                                  ? "#e74c3c"
                                  : req.type === "forbidden"
                                  ? "#c0392b"
                                  : "#27ae60",
                              fontWeight: "bold",
                              marginLeft: "0.5rem"
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}