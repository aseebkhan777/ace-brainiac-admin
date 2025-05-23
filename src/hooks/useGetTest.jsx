import { useState, useEffect, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useGetTest = (testId) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
 
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTest = useCallback(async () => {
    if (!testId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      const response = await api.get(`/admin/test/${testId}`);
      
      if (response.data && response.data.data) {
        setTest(response.data.data);
        return response.data.data;
      } else {
        setError("Invalid response structure");
        return null;
      }
    } catch (err) {
      console.error("Get test error:", err);
      setError(err.response?.data?.message || "Failed to fetch test details");
      return null;
    } finally {
      setLoading(false);
    }
  }, [testId]);

  
  const refreshTest = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (testId) {
      fetchTest();
    }
  }, [testId, refreshTrigger, fetchTest]);

  return { test, loading, error, fetchTest, refreshTest };
};

export default useGetTest;