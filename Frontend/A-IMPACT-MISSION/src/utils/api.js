import axios from "axios";

const API_BASE_URL = "http://localhost:4000";

export const businessAPI = {
  async getRequirements(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/business`, data);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || error.message || "שגיאה בשליחה לשרת"
      );
    }
  },
};

export const validateFormData = (size, seating) => {
  const sizeNumber = parseFloat(size);
  const seatingNumber = parseFloat(seating);

  if (isNaN(sizeNumber) || isNaN(seatingNumber) || sizeNumber <= 0 || seatingNumber <= 0) {
    return {
      isValid: false,
      error: "אנא הכנס מספרים תקינים וחיוביים לגודל העסק ומספר מקומות הישיבה"
    };
  }

  return {
    isValid: true,
    data: {
      size: sizeNumber,
      seating: seatingNumber
    }
  };
};
