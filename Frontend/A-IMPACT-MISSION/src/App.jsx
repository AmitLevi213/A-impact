import React, { useState } from "react";
import axios from "axios";
import BusinessInputs from "./Form/Components/BusinessInputs";
import SubmitButton from "./Form/Components/SubmitButton";
import ThemeToggleButton from "./Form/Components/ThemeToggleButton";
import DarkThemeProvider, { ThemeContext } from "./Providers/DarkThemeProvider";
import "./App.css";

function AppContent() {
  const [size, setSize] = useState("");
  const [seating, setSeating] = useState("");
  const [gas, setGas] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:4000/business", {
        size: size,
        seating: seating,
        gas,
        delivery,
      });
      setRequirements(res.data.requirements || []);
    } catch (err) {
      console.error("Axios error:", err);
      setError("שגיאה בשליחה לשרת", err);
    }
  };

  return (
    <div className="main-container" dir="rtl">
      <ThemeToggleButton />
      <h1>📋 בודק רישוי עסקים</h1>
      <h2>שאלון רישוי עסק</h2>
      <form onSubmit={handleSubmit}>
        <BusinessInputs
          size={size}
          setSize={setSize}
          seating={seating}
          setSeating={setSeating}
          gas={gas}
          setGas={setGas}
          delivery={delivery}
          setDelivery={setDelivery}
        />
        <SubmitButton />
      </form>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {requirements.length > 0 && (
        <div>
          <h3>דרישות לעסק:</h3>
          <ul>
            {requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <DarkThemeProvider>
      <AppContent />
    </DarkThemeProvider>
  );
}
