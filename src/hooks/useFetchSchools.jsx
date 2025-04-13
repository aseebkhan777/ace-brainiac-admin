import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchSchools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (requestMadeRef.current) return;
        
        const fetchSchools = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get("/admin/schools"); // Adjust endpoint as needed
                console.log("Raw API response:", response.data);
                
                if (response.data?.data && Array.isArray(response.data.data)) {
                    // Directly use the fields from the API response without renaming
                    const schoolsData = response.data.data.map(school => ({
                        // Keep all original fields from the API
                        ...school,
                        
                        // Add formatted dates
                        formattedCreatedAt: new Date(school.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }),
                        formattedUpdatedAt: new Date(school.updatedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        })
                    }));
                    
                    setSchools(schoolsData);
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setSchools([]);
                }
            } catch (err) {
                console.error("Error fetching schools:", err);
                setSchools([]);
                setError(err.response?.data?.message || "Failed to fetch schools");
            } finally {
                setLoading(false);
            }
        };

        fetchSchools();
    }, []);

    return { schools, loading, error };
};

export default useFetchSchools;