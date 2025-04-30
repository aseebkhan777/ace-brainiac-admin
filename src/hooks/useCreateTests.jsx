import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";


const useCreateTest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createTest = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const api = apiWithAuth();
      // Send the form data in the request body
      const response = await api.post("/admin/test", formData || {}); 

      if (response.data && response.data.data && response.data.data.id) {
        return response.data.data.id; // ✅ Return only the test ID
      } else {
        setError("Invalid response structure");
        return null;
      }
    } catch (err) {
      console.error("Create test error:", err);
      setError(err.response?.data?.message || "Failed to create test");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createTest, loading, error };
};

export default useCreateTest;