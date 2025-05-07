import { useState } from 'react';
import { apiWithAuth } from "../axios/Instance";

const useDeleteSchool = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteSchool = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      const api = apiWithAuth();
      await api.delete(`/admin/schools/${id}`);
      setDeleteSuccess(true);
      return true;
    } catch (error) {
      console.error("Error deleting school:", error);
      setDeleteError(error.response?.data?.message || "Failed to delete school");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteSchool,
    isDeleting,
    deleteError,
    deleteSuccess,
    resetDeleteState: () => {
      setDeleteError(null);
      setDeleteSuccess(false);
    }
  };
};

export default useDeleteSchool;