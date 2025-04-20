import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";

const useGetClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      const response = await api.get("/persona/classes");
      
      if (response.data && response.data.data) {
        // Store the original class data with both ID and class name
        setClasses(response.data.data);
        return response.data.data;
      } else {
        setError("Invalid response structure");
        return [];
      }
    } catch (err) {
      console.error("Get classes error:", err);
      setError(err.response?.data?.message || "Failed to fetch classes");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  return { classes, loading, error, fetchClasses };
};

export default useGetClasses;