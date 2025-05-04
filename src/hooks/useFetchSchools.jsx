import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchSchools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
   
    // Parameters 
    const [params, setParams] = useState({
        page: 1,
        limit: 9, 
        query: '',
        status: '',
        createDate: ''
    });

    const timeoutRef = useRef(null);
    const initialFetchDoneRef = useRef(false);

    // refetch
    const handleChangeParams = useCallback(({ param, newValue }) => {
        setParams(prevParams => {
            if (param === 'query' || param === 'status' || param === 'createDate') {
                return {
                    ...prevParams,
                    [param]: newValue,
                    page: 1 
                };
            }
            return { ...prevParams, [param]: newValue };
        });
    }, []);

    // Format date to YYYY-MM-DD format
    const formatDateParameter = (dateValue) => {
        if (!dateValue) return '';
        
        
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }
        
        // Convert to Date object if it's not already
        const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
        
        // Check if date is valid
        if (isNaN(date.getTime())) return '';
        
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${year}-${month}-${day}`;
    };

    const fetchSchools = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
           
            const queryParams = new URLSearchParams();
            
            // Calculate offset based on page and limit
            const offset = (params.page - 1) * params.limit;
            
            // Add all parameters
            queryParams.append('limit', params.limit);
            queryParams.append('page', params.page);
            
            if (params.query) queryParams.append('query', params.query);
            if (params.status) queryParams.append('status', params.status);
            
            
            if (params.createDate) {
                const formattedDate = formatDateParameter(params.createDate);
                if (formattedDate) queryParams.append('date', formattedDate); 
            }
            
            console.log("Fetching schools with params:", { ...params, offset });
            const response = await api.get(`/admin/schools?${queryParams.toString()}`);
            
        
            if (response.data?.data?.schools && Array.isArray(response.data.data.schools)) {
                const schoolsData = response.data.data.schools.map(school => ({
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
                
               
                if (response.data.data.pagination) {
                    const { totalPages, totalItems, currentPage, itemsPerPage } = response.data.data.pagination;
                    setTotalItems(totalItems);
                    setTotalPages(totalPages);
                } else {
                    setTotalPages(Math.ceil(schoolsData.length / params.limit));
                    setTotalItems(schoolsData.length);
                }
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setSchools([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching schools:", err);
            setSchools([]);
            setError(err.response?.data?.message || "Failed to fetch schools");
            setTotalPages(1);
            setTotalItems(0);
        } finally {
            setLoading(false);
        }
    }, [params]);

    
    useEffect(() => {
        if (!initialFetchDoneRef.current) {
            initialFetchDoneRef.current = true;
            fetchSchools();
        }
        
    }, []);

    
    useEffect(() => {
        
        if (!initialFetchDoneRef.current) return;
        
       
        if (params.query !== undefined && params.query !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchSchools();
            }, 500);
        } else {
            
            fetchSchools();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchSchools]);

    return { 
        schools, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchSchools 
    };
};

export default useFetchSchools;