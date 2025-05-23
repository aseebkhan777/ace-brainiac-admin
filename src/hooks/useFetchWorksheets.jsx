import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchWorksheets = () => {
    const [worksheets, setWorksheets] = useState([]);
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

    const fetchWorksheets = useCallback(async () => {
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
            if (params.class) queryParams.append('class', params.class);
            if (params.subject) queryParams.append('subject', params.subject);
            
            if (params.date) {
                const formattedDate = formatDateParameter(params.date);
                if (formattedDate) queryParams.append('date', formattedDate);
            }
            
            console.log("Fetching worksheets with params:", params);
            const response = await api.get(`/admin/worksheet?${queryParams.toString()}`);
            
           
            if (response.data?.data?.worksheets && Array.isArray(response.data.data.worksheets)) {
                const worksheetsData = response.data.data.worksheets.map(worksheet => {
                    return {
                        id: worksheet.id,
                        title: worksheet.title || "Untitled Worksheet",
                        description: worksheet.description || "No description",
                        subject: worksheet.subject || "N/A",
                        class: worksheet.class || "N/A",
                        createdBy: worksheet.createdBy || "Unknown",
                        createdAt: worksheet.createdAt,
                        updatedAt: worksheet.updatedAt,
                        fileUrl: worksheet.pdfUrl || "",
                        
                        // Formatted dates
                        formattedCreatedAt: new Date(worksheet.createdAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }),
                        formattedUpdatedAt: worksheet.updatedAt ? new Date(worksheet.updatedAt).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }) : 'N/A'
                    };
                });
                
                setWorksheets(worksheetsData);
                
                // Handle pagination information
                if (response.data.data.pagination) {
                    const { totalPages, totalItems, currentPage, itemsPerPage } = response.data.data.pagination;
                    setTotalItems(totalItems);
                    setTotalPages(totalPages);
                } else {
                    
                    const count = response.data.data.count || worksheetsData.length;
                    setTotalItems(count);
                    setTotalPages(Math.ceil(count / params.limit));
                }
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setWorksheets([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching worksheets:", err);
            setWorksheets([]);
            setError(err.response?.data?.message || "Failed to fetch worksheets");
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
            fetchWorksheets();
        }
    }, []);

    
    useEffect(() => {
        if (!initialFetchDoneRef.current) return;
        
        
        if (params.query !== undefined && params.query !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchWorksheets();
            }, 500);
        } else {
            fetchWorksheets();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchWorksheets]);

    return { 
        worksheets, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchWorksheets 
    };
};

export default useFetchWorksheets;