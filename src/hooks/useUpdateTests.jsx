import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";


const useUpdateTest = (testId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateTest = async (settings) => {
    setLoading(true);
    setError(null);
    try {
      const api = apiWithAuth();
      await api.put(`/admin/test/${testId}`, settings);
      console.log("test updated successfully with settings", settings);
      return true; // Success
    } catch (err) {
      console.error("Update test error:", err);
      setError(err.response?.data?.message || "Failed to update test settings");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateTest, loading, error };
};

export default useUpdateTest;