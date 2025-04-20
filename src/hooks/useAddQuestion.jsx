import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";


const useAddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addBulkQuestions = async (testId, questionsData) => {
    if (!testId) {
      console.error("Error: testId is undefined or null");
      setError("Invalid test ID");
      return false;
    }

    console.log("Using testId:", testId);
    console.log("Bulk Questions Data Sent to API:", questionsData);
    
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      const response = await api.put(`/admin/test/${testId}/bulk-questions`, questionsData);
      console.log("API Response:", response.data);
      return true; // Success
    } catch (err) {
      console.error("Add bulk questions error:", err);
      console.error("Full error response:", err.response?.data);
      setError(err.response?.data?.message || "Failed to add questions");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addBulkQuestions, loading, error };
};

export default useAddQuestion;