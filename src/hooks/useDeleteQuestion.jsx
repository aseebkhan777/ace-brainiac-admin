import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useDeleteQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteQuestion = async (testId, questionId) => {
    if (!testId || !questionId) {
      setError("Test ID and Question ID are required");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();
      await api.delete(`/admin/test/${testId}/question/${questionId}`);
      setLoading(false);
      return true;
    } catch (err) {
      console.error("Error deleting question:", err);
      setError(err.response?.data?.message || "Failed to delete question");
      setLoading(false);
      return false;
    }
  };

  return { deleteQuestion, loading, error };
};

export default useDeleteQuestion;