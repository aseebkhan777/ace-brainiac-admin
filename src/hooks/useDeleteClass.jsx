import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";
import { toast } from "react-toastify";

const useDeleteClass = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const deleteClass = async (classId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const api = apiWithAuth();
      await api.delete(`/admin/class/${classId}`);
      
      // Show success toast
      toast.success("Class deleted successfully!");
      
      setSuccess(true);
      return true;
    } catch (err) {
      console.error("Error deleting class:", err);
      const errorMessage = err.response?.data?.message || "Failed to delete class";
      
      // Show error toast
      toast.error(errorMessage);
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteClass, loading, error, success };
};

export default useDeleteClass;