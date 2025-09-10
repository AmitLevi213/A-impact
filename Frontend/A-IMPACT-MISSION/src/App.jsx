import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DarkThemeProvider from "./Providers/DarkThemeProvider";
import LoadingFallback from "./Components/LoadingFallback";
import "./App.css";

// Lazy load pages for better code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));

function Navigation() {
  return (
    <nav style={{ 
      marginBottom: "2rem", 
      padding: "1rem", 
      backgroundColor: "#f8f9fa", 
      borderRadius: "0.5rem" 
    }}>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <Link 
          to="/" 
          style={{ 
            textDecoration: "none", 
            color: "#333", 
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            backgroundColor: "#e9ecef"
          }}
        >
          🏠 בית
        </Link>
        <Link 
          to="/about" 
          style={{ 
            textDecoration: "none", 
            color: "#333", 
            fontWeight: "bold",
            padding: "0.5rem 1rem",
            borderRadius: "0.25rem",
            backgroundColor: "#e9ecef"
          }}
        >
          ℹ️ אודות
        </Link>
      </div>
    </nav>
  );
}

function AppContent() {
  return (
    <Router>
      <div className="main-container" dir="rtl">
        <Navigation />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <DarkThemeProvider>
      <AppContent />
    </DarkThemeProvider>
  );
}
