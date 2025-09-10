import { useState } from "react";
import { businessAPI, validateFormData } from "../utils/api";

export function useBusinessForm() {
  const [size, setSize] = useState("");
  const [seating, setSeating] = useState("");
  const [gas, setGas] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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
    } catch (err) {
      console.error("API error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setRequirements([]);
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
    error,
    loading,
    // Actions
    handleSubmit,
    clearResults,
  };
}
