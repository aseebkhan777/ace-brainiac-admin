import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";
import { toast } from "react-toastify";

const useAddClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const addClass = async (className) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const api = apiWithAuth();
      const response = await api.post("/admin/class", { class: className });
      
      // Show success toast
      toast.success("Class added successfully!");
      
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Error adding class:", err);
      const errorMessage = err.response?.data?.message || "Failed to add class";
      
      // Show error toast
      toast.error(errorMessage);
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addClass, loading, error, success };
};

export default useAddClass;