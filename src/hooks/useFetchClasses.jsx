import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchClasses = (refreshKey = 0) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                const api = apiWithAuth();
                const response = await api.get("/persona/classes"); // Adjust endpoint as needed
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
    }, [refreshKey]); // Added refreshKey as a dependency

    return { classes, loading, error };
};

export default useFetchClasses;