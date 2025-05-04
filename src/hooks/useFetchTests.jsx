import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchTests = () => {
    const [tests, setTests] = useState([]);
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
        certification: '',
        createDate: ''
    });

    const timeoutRef = useRef(null);
    const initialFetchDoneRef = useRef(false);

    // Handle parameter changes
    const handleChangeParams = useCallback(({ param, newValue }) => {
        setParams(prevParams => {
            if (param === 'query' || param === 'status' || param === 'certification' || param === 'createDate') {
                return {
                    ...prevParams,
                    [param]: newValue,
                    page: 1 
                };
            }
            return { ...prevParams, [param]: newValue };
        });
    }, []);

    // Format date 
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

    const fetchTests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
            // Create query parameters
            const queryParams = new URLSearchParams();
            
            // Add all parameters
            queryParams.append('limit', params.limit);
            queryParams.append('page', params.page);
            
            if (params.query) queryParams.append('query', params.query);
            if (params.status) queryParams.append('status', params.status);
            if (params.certification) queryParams.append('certification', params.certification);
            
            
            if (params.createDate) {
                const formattedDate = formatDateParameter(params.createDate);
                if (formattedDate) queryParams.append('date', formattedDate);
            }
            
            console.log("Fetching tests with params:", params);
            const response = await api.get(`/admin/test?${queryParams.toString()}`);
            
        
            if (response.data?.data?.tests && Array.isArray(response.data.data.tests)) {
                
                const testsData = response.data.data.tests.map(test => ({
                    id: test.id,
                    name: test.title || "Untitled Test",
                    description: [test.subject, test.class].filter(Boolean).join(" - ") || "No description",
                    status: test.status === "DRAFT" ? "Draft" : "Published",
                    certificationAvailable: Boolean(test.certificationAvailable),
                    total_questions: test.questions?.length || 0,
                    duration: test.duration || null,
                    pass_percentage: test.pass_percentage || test.totalMarks || "N/A",
                    created_by: test.created_by || "Admin",
                    createdAt: test.createdAt || new Date().toISOString()
                }));
                
                setTests(testsData);
                
               
                if (response.data.data.pagination) {
                    const { totalPages, totalItems, currentPage, itemsPerPage } = response.data.data.pagination;
                    setTotalItems(totalItems);
                    setTotalPages(totalPages);
                } else {
                    
                    setTotalPages(Math.ceil(testsData.length / params.limit));
                    setTotalItems(testsData.length);
                }
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setTests([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching tests:", err);
            setTests([]);
            setError(err.response?.data?.message || "Failed to fetch tests");
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
            fetchTests();
        }
    }, []);

    
    useEffect(() => {
        if (!initialFetchDoneRef.current) return;
        
        
        if (params.query !== undefined && params.query !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchTests();
            }, 500);
        } else {
            fetchTests();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchTests]);

    return { 
        tests, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchTests 
    };
};

export default useFetchTests;