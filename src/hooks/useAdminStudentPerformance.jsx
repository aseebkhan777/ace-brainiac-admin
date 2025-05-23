import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";


const useAdminStudentPerformance = (studentId, page = 1, itemsPerPage = 9, searchQuery = "", subjectFilter = "") => {
    const [student, setStudent] = useState(null);
    const [tests, setTests] = useState([]);
    const [stats, setStats] = useState({
        totalTests: 0,
        averageScore: 0,
        topScore: 0
    });
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [testsLoading, setTestsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [testsError, setTestsError] = useState(null);
    
    // Fetch student info and overall performance
    useEffect(() => {
        const fetchStudentData = async () => {
            if (!studentId) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const api = apiWithAuth();
                const response = await api.get(`/admin/performance/students/${studentId}`);
                
                if (response.data?.data) {
                    setStudent(response.data.data.student || null);
                    setStats(response.data.data.overallPerformance || {
                        totalTests: 0,
                        averageScore: 0,
                        topScore: 0
                    });
                }
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError(err.response?.data?.message || "Failed to fetch student data");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    // Fetch tests separately
    useEffect(() => {
        const fetchTests = async () => {
            if (!studentId) return;
            
            setTestsLoading(true);
            setTestsError(null);
            
            try {
                const api = apiWithAuth();
                
                // Build query parameters
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', itemsPerPage);
                
                if (searchQuery) params.append('search', searchQuery);
                if (subjectFilter) params.append('subject', subjectFilter);
                
                const response = await api.get(`/admin/performance/students/${studentId}/tests?${params.toString()}`);
                
                if (response.data?.data) {
                    setTests(response.data.data.tests || []);
                    // Set totalPages based on pagination data if available
                    if (response.data.data.pagination && response.data.data.pagination.totalPages) {
                        setTotalPages(response.data.data.pagination.totalPages);
                    } else {
                        // Fallback to calculating pages based on total count
                        const totalItems = response.data.data.pagination?.total || 0;
                        setTotalPages(Math.ceil(totalItems / itemsPerPage) || 1);
                    }
                }
            } catch (err) {
                console.error("Error fetching tests:", err);
                setTestsError(err.response?.data?.message || "Failed to fetch tests");
                setTests([]);
            } finally {
                setTestsLoading(false);
            }
        };

        fetchTests();
    }, [studentId, page, itemsPerPage, searchQuery, subjectFilter]);

    const suspendStudent = async () => {
        if (!studentId) return { success: false, message: "Student ID is required" };
        
        try {
            const api = apiWithAuth();
            const response = await api.patch(`/admin/student/suspend/${studentId}`);
            return { 
                success: true, 
                message: response.data?.message || "Student suspended successfully" 
            };
        } catch (err) {
            console.error("Error suspending student:", err);
            return { 
                success: false, 
                message: err.response?.data?.message || "Failed to suspend student" 
            };
        }
    };

    return { 
        student, 
        tests, 
        stats, 
        totalPages, 
        loading, 
        testsLoading,
        error, 
        testsError,
        suspendStudent 
    };
};

export default useAdminStudentPerformance;