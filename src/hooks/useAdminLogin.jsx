import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { apiWithAuth } from "../axios/Instance";
import { setupFCM } from "../utils/fcmService";
import { useNavigate } from "react-router-dom";

const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const fcmInitialized = useRef(false);

    // Initialize FCM early - this can start the service worker registration process
    const prepareFCM = () => {
        // Only initialize once
        if (fcmInitialized.current) {
            return;
        }
        
        // Mark as initialized
        fcmInitialized.current = true;
        
        // Start service worker registration
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/firebase-messaging-sw.js')
                .then(registration => {
                    console.log('Pre-login service worker registered:', registration);
                })
                .catch(error => {
                    console.error('Pre-login service worker registration failed:', error);
                });
        }
    };

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
                
                // Store token in localStorage
                localStorage.setItem("adminAuthToken", token);
                
                // Store user details in localStorage if available
                if (user_details) {
                    localStorage.setItem("adminDetails", JSON.stringify(user_details));
                }
                
                // Try FCM setup for a limited time, don't let it block the login flow
                let fcmSuccess = false;
                
                try {
                    // Set a timeout for FCM setup to avoid blocking login indefinitely
                    const fcmToken = await Promise.race([
                        setupFCM(),
                        new Promise((_, reject) => setTimeout(() => 
                            reject(new Error("FCM setup timed out")), 3000)
                        )
                    ]);
                    
                    if (fcmToken) {
                        console.log("FCM token generated successfully:", fcmToken);
                        fcmSuccess = true;
                    } else {
                        console.log("FCM setup completed but no token was generated");
                    }
                } catch (fcmError) {
                    console.error("FCM setup failed or timed out:", fcmError);
                    // Continue with login flow even if FCM setup fails
                }
                
                toast.success("Admin login successful", {
                    position: "top-right",
                    autoClose: 2000,
                });
                
                // Navigate to admin dashboard after successful login
                setTimeout(() => {
                    navigate("/admin/dashboard");
                }, 2000);
                
                // If FCM failed, try again in the background
                if (!fcmSuccess) {
                    setTimeout(() => {
                        setupFCM().then(token => {
                            if (token) {
                                console.log("Delayed FCM token generated:", token);
                            }
                        }).catch(error => {
                            console.error("Delayed FCM setup failed:", error);
                        });
                    }, 5000);
                }
                
                return response.data;
            } else {
                const errorMessage = response.data.message || "Invalid response from server";
                setError(errorMessage);
                toast.error(errorMessage, {
                    position: "top-right",
                    autoClose: 3000,
                });
                return null;
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Admin login failed";
            setError(errorMessage);
            toast.error(errorMessage, {
                position: "top-right",
                autoClose: 3000,
            });
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { loginAdmin, loading, error, prepareFCM };
};

export default useAdminLogin;