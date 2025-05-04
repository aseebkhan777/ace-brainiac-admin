import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchStudents = () => {
    const [students, setStudents] = useState([]);
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
        status: '',
        date: '' 
    });

    const timeoutRef = useRef(null);
    const initialFetchDoneRef = useRef(false);

    
    const handleChangeParams = useCallback(({ param, newValue }) => {
        setParams(prevParams => {
            
            if (param === 'status') {
               
                const statusValue = typeof newValue === 'object' && newValue !== null ? 
                    (newValue.value || '') : 
                    newValue;
                
                return {
                    ...prevParams,
                    status: statusValue,
                    page: 1
                };
            }
            
            if (param === 'query' || param === 'class' || param === 'date') {
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

    const fetchStudents = useCallback(async () => {
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
            if (params.status) queryParams.append('status', params.status);
            
            
            if (params.date) {
                const formattedDate = formatDateParameter(params.date);
                if (formattedDate) queryParams.append('date', formattedDate);
            }
            
            console.log("Fetching students with params:", params);
            const response = await api.get(`/admin/student?${queryParams.toString()}`);
            
            if (response.data?.data?.students && Array.isArray(response.data.data.students)) {
                const studentsData = response.data.data.students.map(student => ({
                    
                    id: student.id,
                    user_id: student.user_id,
                    dob: student.dob,
                    gender: student.gender,
                    class: student.class,
                    address: student.address,
                    parentage: student.parentage,
                    alternatePhone: student.alternatePhone,
                    is_registered: student.is_registered,
                    createdAt: student.createdAt,
                    updatedAt: student.updatedAt,
                    
                    
                    name: student.user?.name || "Unknown",
                    email: student.user?.email || "Not provided",
                    phone: student.user?.phone || "Not provided",
                    status: student.user?.status || "Unknown",
                    
                    
                    formattedDob: new Date(student.dob).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    }),
                    
                    // Add formatted created date
                    formattedCreatedAt: new Date(student.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    })
                }));
                
                setStudents(studentsData);
                
                
                if (response.data.data.pagination) {
                    const { totalPages, totalItems, currentPage, itemsPerPage } = response.data.data.pagination;
                    setTotalItems(totalItems);
                    setTotalPages(totalPages);
                } else {
                    
                    const count = response.data.data.count || studentsData.length;
                    setTotalItems(count);
                    setTotalPages(Math.ceil(count / params.limit));
                }
            } else {
                console.warn("Unexpected API response structure:", response.data);
                setStudents([]);
                setTotalPages(1);
                setTotalItems(0);
            }
        } catch (err) {
            console.error("Error fetching students:", err);
            setStudents([]);
            setError(err.response?.data?.message || "Failed to fetch students");
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
            fetchStudents();
        }
    }, []);

   
    useEffect(() => {
        if (!initialFetchDoneRef.current) return;
        
        
        if (params.query !== undefined && params.query !== null) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                fetchStudents();
            }, 500);
        } else {
            fetchStudents();
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [params, fetchStudents]);

    return { 
        students, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch: fetchStudents 
    };
};

export default useFetchStudents;