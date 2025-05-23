import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchAdminPerformances = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
   
    // Parameters 
    const [params, setParams] = useState({
        page: 1,
        limit: 9, 
        query: '',
        class: '',
        subject: '',
        date: '' 
    });

    const timeoutRef = useRef(null);
    const initialFetchDoneRef = useRef(false);

    const handleChangeParams = useCallback(({ param, newValue }) => {
        setParams(prevParams => {
            if (param === 'query' || param === 'class' || param === 'subject' || param === 'date') {
                return {
                    ...prevParams,
                    [param]: newValue,
                    page: 1
                };
            }
            return { ...prevParams, [param]: newValue };
        });
    }, []);

    const formatDateParameter = (dateValue) => {
        if (!dateValue) return '';
        
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        
        if (isNaN(date.getTime())) return '';
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    const fetchPerformanceData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
            // Create query parameters
            const queryParams = new URLSearchParams();
            
            // Add all parameters
            queryParams.append('limit', params.limit);
            queryParams.append('page', params.page);
            
            if (params.query) queryParams.append('search', params.query);
            if (params.class) queryParams.append('class', params.class);
            if (params.subject) queryParams.append('subject', params.subject);
            
            if (params.date) {
                const formattedDate = formatDateParameter(params.date);
                if (formattedDate) queryParams.append('date', formattedDate);
            }
            
            console.log("Fetching performance data with params:", params);
            const response = await api.get(`/admin/performance/students?${queryParams.toString()}`);
            
            // Handle the API response structure
            if (response.data?.data?.students && Array.isArray(response.data.data.students)) {
                setPerformanceData(response.data.data.students);
                
                // Handle pagination information
                if (response.data.data.pagination) {
                    const { total, totalPages } = response.data.data.pagination;
                    setTotalItems(total);
                    setTotalPages(totalPages);
                } else {
                    setTotalItems(response.data.data.students.length);
                    setTotalPages(Math.ceil(response.data.data.students.length / params.limit));
                }
            } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                setPerformanceData(response.data.data.data);
                
                // Handle pagination from alternative response structure
                if (response.data.data.pagination) {
                    const { total, totalPages } = response.data.data.pagination;
                    setTotalItems(total);
                    setTotalPages(totalPages);
                } else {
                    setTotalItems(response.data.data.count || response.data.data.data.length);
                    setTotalPages(Math.ceil((response.data.data.count || response.data.data.data.length) / params.limit));
                }
            } else if (response.data?.data && Array.isArray(response.data.data)) {
                setPerformanceData(response.data.data);
                setTotalItems(response.data.count || response.data.data.length);
                setTotalPages(Math.ceil((response.data.count || response.data.data.length) / params.limit));
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setPerformanceData([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching performance data:", err);
            setPerformanceData([]);
            setError(err.response?.data?.message || "Failed to fetch performance data");
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [params]);

    // Initial fetch
    useEffect(() => {
        if (!initialFetchDoneRef.current) {
            initialFetchDoneRef.current = true;
            fetchPerformanceData();
        }
    }, []);

    // Fetch data when params change
    useEffect(() => {
        if (!initialFetchDoneRef.current) return;
        
        // Add debounce for search queries
        if (params.query !== undefined && params.query !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchPerformanceData();
            }, 500);
        } else {
            fetchPerformanceData();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchPerformanceData]);

    return { 
        performanceData, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchPerformanceData 
    };
};

export default useFetchAdminPerformances;