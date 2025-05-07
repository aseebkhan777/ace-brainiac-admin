import { useState } from 'react';
import { apiWithAuth } from "../axios/Instance";

const useDeleteStudent = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const deleteStudent = async (id) => {
    setIsDeleting(true);
    setDeleteError(null);
    setDeleteSuccess(false);

    try {
      const api = apiWithAuth();
      await api.delete(`/admin/student/${id}`);
      setDeleteSuccess(true);
      return true;
    } catch (error) {
      console.error("Error deleting student:", error);
      setDeleteError(error.response?.data?.message || "Failed to delete student");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    deleteStudent,
    isDeleting,
    deleteError,
    deleteSuccess,
    resetDeleteState: () => {
      setDeleteError(null);
      setDeleteSuccess(false);
    }
  };
};

export default useDeleteStudent;