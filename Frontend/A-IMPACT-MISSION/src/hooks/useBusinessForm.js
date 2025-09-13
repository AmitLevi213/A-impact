import { useState } from "react";
import { businessAPI, validateFormData } from "../utils/api";

export function useBusinessForm() {
  const [size, setSize] = useState("");
  const [seating, setSeating] = useState("");
  const [gas, setGas] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // Check cooldown period (30 seconds between submissions)
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    const cooldownPeriod = 30000; // 30 seconds
    
    if (timeSinceLastSubmission < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeSinceLastSubmission) / 1000);
      setError(`אנא המתן ${remainingTime} שניות לפני שליחה נוספת`);
      return;
    }
    
    setLoading(true);
    setLastSubmissionTime(now);

    // Validate form data
    const validation = validateFormData(size, seating);
    if (!validation.isValid) {
      setError(validation.error);
      setLoading(false);
      return;
    }

    try {
      const res = await businessAPI.getRequirements({
        ...validation.data,
        gas,
        delivery,
      });
      setRequirements(res.regulations || []);
      setAiReport(res.aiReport || "");
    } catch (err) {
      console.error("API error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setRequirements([]);
    setAiReport("");
  };

  // Calculate remaining cooldown time
  const getRemainingCooldown = () => {
    const now = Date.now();
    const timeSinceLastSubmission = now - lastSubmissionTime;
    const cooldownPeriod = 30000; // 30 seconds
    
    if (timeSinceLastSubmission < cooldownPeriod) {
      return Math.ceil((cooldownPeriod - timeSinceLastSubmission) / 1000);
    }
    return 0;
  };

  // Check if form can be submitted
  const canSubmit = () => {
    return !loading && getRemainingCooldown() === 0;
  };

  return {
    // Form state
    size,
    setSize,
    seating,
    setSeating,
    gas,
    setGas,
    delivery,
    setDelivery,
    // Results state
    requirements,
    aiReport,
    error,
    loading,
    // Rate limiting state
    lastSubmissionTime,
    getRemainingCooldown,
    canSubmit,
    // Actions
    handleSubmit,
    clearResults,
  };
}
