import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchClasses = (page = 1, searchQuery = "", limit = 6, refreshKey = 0) => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        totalItems: 0,
        totalPages: 1,
        currentPage: 1,
        itemsPerPage: limit,
        hasNextPage: false,
        hasPreviousPage: false
    });

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            setError(null);
            try {
                const api = apiWithAuth();
                
                // Build query parameters for pagination and search
                const params = new URLSearchParams();
                params.append("page", page);
                params.append("limit", limit);
                
                if (searchQuery) {
                    params.append("search", searchQuery);
                }
                
                const response = await api.get(`/persona/classes?${params.toString()}`);
                console.log("Raw API response:", response.data);
                
                if (response.data?.data) {
                    // Handle data
                    if (Array.isArray(response.data.data.data)) {
                        const classesData = response.data.data.data.map(classItem => {
                            return {
                                id: classItem.id,
                                name: classItem.class,
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
                        
                        // Set pagination information
                        if (response.data.data.pagination) {
                            setPagination(response.data.data.pagination);
                        }
                    } else {
                        console.warn("Unexpected API response structure:", response.data);
                        setClasses([]);
                    }
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
    }, [page, searchQuery, limit, refreshKey]); 

    return { classes, loading, error, pagination };
};

export default useFetchClasses;