import React, { Suspense, lazy } from "react";
import ThemeToggleButton from "../Form/Components/ThemeToggleButton";
import { useBusinessForm } from "../hooks/useBusinessForm";
import LoadingFallback from "../Components/LoadingFallback";

// Lazy load components for better code splitting
const FormSection = lazy(() => import("../Components/FormSection"));
const ResultsSection = lazy(() => import("../Components/ResultsSection"));
const LoadingIndicator = lazy(() => import("../Components/LoadingIndicator"));
const ErrorDisplay = lazy(() => import("../Components/ErrorDisplay"));

export default function HomePage() {
  const {
    size,
    setSize,
    seating,
    setSeating,
    gas,
    setGas,
    delivery,
    setDelivery,
    requirements,
    aiReport,
    error,
    loading,
    canSubmit,
    getRemainingCooldown,
    handleSubmit,
    clearResults,
  } = useBusinessForm();

  return (
    <div className="main-container" dir="rtl">
      <ThemeToggleButton />
      <h1>📋 בודק רישוי עסקים</h1>
      <h2>שאלון רישוי עסק</h2>
      
      <Suspense fallback={<LoadingFallback />}>
        <FormSection
          size={size}
          setSize={setSize}
          seating={seating}
          setSeating={setSeating}
          gas={gas}
          setGas={setGas}
          delivery={delivery}
          setDelivery={setDelivery}
          loading={loading}
          canSubmit={canSubmit}
          getRemainingCooldown={getRemainingCooldown}
          onSubmit={handleSubmit}
        />
      </Suspense>

      <Suspense fallback={<LoadingFallback />}>
        <ErrorDisplay error={error} />
      </Suspense>

      {loading && (
        <Suspense fallback={<LoadingFallback />}>
          <LoadingIndicator />
        </Suspense>
      )}

      <Suspense fallback={<LoadingFallback />}>
        <ResultsSection
          requirements={requirements}
          aiReport={aiReport}
          onClearResults={clearResults}
        />
      </Suspense>
    </div>
  );
}
