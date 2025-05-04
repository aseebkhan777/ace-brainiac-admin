import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useDeleteMembership = () => {
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    const deleteMembership = async (membershipId) => {
        if (!membershipId) {
            setDeleteError("Membership ID is required");
            return { success: false };
        }

        setDeleteLoading(true);
        setDeleteError(null);
        setDeleteSuccess(false);

        try {
            const api = apiWithAuth();
            await api.delete(`/admin/membership/${membershipId}`);
            
            setDeleteSuccess(true);
            return { success: true };
        } catch (err) {
            console.error("Error deleting membership:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete membership";
            setDeleteError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setDeleteLoading(false);
        }
    };

    return { 
        deleteMembership, 
        deleteLoading, 
        deleteError, 
        deleteSuccess,
        clearDeleteStatus: () => {
            setDeleteError(null);
            setDeleteSuccess(false);
        }
    };
};

export default useDeleteMembership;