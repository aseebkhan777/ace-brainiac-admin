import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchSchools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
   
    const [params, setParams] = useState({
        limit: 10,
        offset: 0,
        query: '',
        status: '',
        createDate: ''
    });

    const timeoutRef = useRef(null);

    const handleChangeParams = ({param, newValue})=> {
        setParams({
            ...params,
            [param] : newValue
        });

        // Reset request flag when params change
        requestMadeRef.current = false;
    };

    const fetchSchools = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
            // Build query string with only non-empty parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== '' && value !== null && value !== undefined) {
                    queryParams.append(key, value);
                }
            });

            const response = await api.get(`/admin/schools?${queryParams.toString()}`);
            console.log("Raw API response:", response.data);
            
            if (response.data?.data && Array.isArray(response.data.data)) {
                const schoolsData = response.data.data.map(school => ({
                    ...school,
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
    }, [params]);

    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (requestMadeRef.current) return;
        requestMadeRef.current = true;
        
        // If the change is in query parameter, apply debouncing
        if (params.query) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchSchools();
            }, 500); // 500ms debounce delay
        } else {
            // For other parameter changes, fetch immediately
            fetchSchools();
        }

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchSchools]);

    return { schools, loading, error, handleChangeParams, params };
};

export default useFetchSchools;