import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchClasses = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (requestMadeRef.current) return;
        
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get("/admin/class"); // Adjust endpoint as needed
                console.log("Raw API response:", response.data);
                
                if (response.data?.data && Array.isArray(response.data.data)) {
                    const classesData = response.data.data.map(classItem => {
                        return {
                            id: classItem.id,
                            name: classItem.class, // using 'class' field as name
                            createdAt: classItem.createdAt,
                            updatedAt: classItem.updatedAt,
                            deletedAt: classItem.deletedAt,
                            
                            // Formatted dates
                            formattedCreatedAt: new Date(classItem.createdAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            }),
                            formattedUpdatedAt: new Date(classItem.updatedAt).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })
                        };
                    });
                    
                    setClasses(classesData);
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setClasses([]);
                }
            } catch (err) {
                console.error("Error fetching classes:", err);
                setClasses([]);
                setError(err.response?.data?.message || "Failed to fetch classes");
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, []);

    return { classes, loading, error };
};

export default useFetchClasses;