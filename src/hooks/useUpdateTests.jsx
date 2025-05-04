import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useUpdateTest = (testId) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  const updateTest = async (settings) => {
    setLoading(true);
    setError(null);
    
    // Ensure we have a valid testId
    if (!testId) {
      console.error("No testId provided to useUpdateTest hook");
      setError("Missing test ID");
      setLoading(false);
      return false;
    }
    
    // Debug log to verify what we're sending
    console.log("Sending settings to API:", settings);
    
    try {
      const api = apiWithAuth();
      
      // Make sure status is a valid string value (not undefined or null)
      const sanitizedSettings = {
        ...settings,
        status: settings.status || "DRAFT" // Default to DRAFT if status is empty
      };
      
      const response = await api.put(`/admin/test/${testId}`, sanitizedSettings);
      console.log("Update test API response:", response.data);
      
      // Store the updated data
      setUpdatedData(response.data);
      
      // Check if the response indicates success
      const isSuccess = response.status >= 200 && response.status < 300;
      
      if (!isSuccess) {
        console.warn("API returned success status but update may not have applied");
      }
      
      return isSuccess;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update test settings";
      console.error("Update test error:", err, errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { updateTest, loading, error, updatedData };
};

export default useUpdateTest;