import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useDeleteTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteTest = async (testId) => {
    if (!testId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      await api.delete(`/admin/test/${testId}`);
      return true;
    } catch (err) {
      console.error("Delete test error:", err);
      setError(err.response?.data?.message || "Failed to delete test");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTest, loading, error };
};

export default useDeleteTest;