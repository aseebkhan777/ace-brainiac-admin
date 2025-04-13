import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useDeleteWorksheet = () => {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const deleteWorksheet = async (worksheetId) => {
        if (!worksheetId) {
            setDeleteError("Worksheet ID is required");
            return { success: false };
        }

        setDeleteLoading(true);
        setDeleteError(null);
        setDeleteSuccess(false);

        try {
            const api = apiWithAuth();
            await api.delete(`/admin/worksheet/${worksheetId}`);
            
            setDeleteSuccess(true);
            return { success: true };
        } catch (err) {
            console.error("Error deleting worksheet:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete worksheet";
            setDeleteError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setDeleteLoading(false);
        }
    };

    return { 
        deleteWorksheet, 
        deleteLoading, 
        deleteError, 
        deleteSuccess,
        clearDeleteStatus: () => {
            setDeleteError(null);
            setDeleteSuccess(false);
        }
    };
};

export default useDeleteWorksheet;