import { useState } from "react";
import { toast } from "react-toastify";
import { apiWithAuth } from "../axios/Instance";

const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loginAdmin = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            const response = await api.post("/admin/auth/login", { email, password });
            console.log("Response from backend:", response.data);

            if (response.data.statusCode === 200 && response.data.data?.token) {
                const { token, user_details } = response.data.data;  
                console.log("Token received:", token);
                localStorage.setItem("adminAuthToken", token);
                
                // Check user status
                if (user_details && user_details.status === "ACTIVE") {
                    // For active admin users
                    toast.success("Admin login successful", {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    
                    return response.data;
                }
            } else {
                setError(response.data.message || "Invalid response from server");
                toast.error(response.data.message || "Invalid response from server", {
                    position: "top-right",
                    autoClose: 2000,
                });
                return null;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Admin login failed";
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 2000,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loginAdmin, loading, error };
};

export default useAdminLogin;