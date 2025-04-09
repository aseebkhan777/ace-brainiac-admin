import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { apiWithAuth } from "../axios/Instance";

const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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
                
                // Check user status and handle navigation
                if (user_details && user_details.status === "ACTIVE") {
                    // For active admin users
                    toast.success("Admin login successful", {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    
                    setTimeout(() => {
                        navigate("/admin/dashboard");
                    }, 2000);
                } else {
                    // For inactive admin users
                    toast.warning("Account verification required", {
                        position: "top-right",
                        autoClose: 2000,
                    });
                    
                    setTimeout(() => {
                        navigate("/admin/verification");
                    }, 2000);
                }
                
                return response.data;
            } else {
                setError(response.data.message || "Invalid response from server");
                return null;
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Admin login failed");
            toast.error(err.response?.data?.message || "Admin login failed", {
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