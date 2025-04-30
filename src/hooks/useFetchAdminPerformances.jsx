import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";


const useFetchAdminPerformances = (page = 1, itemsPerPage = 6, searchQuery = "", classFilter = "", subjectFilter = "", dateFilter = "") => {
    const [performanceData, setPerformanceData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchAdminPerformance = async () => {
            setLoading(true);
            setError(null);
            try {
                const api = apiWithAuth();
                
                // Build query parameters
                const params = new URLSearchParams();
                params.append('page', page);
                params.append('limit', itemsPerPage);
                
                if (searchQuery) params.append('search', searchQuery);
                if (classFilter) params.append('class', classFilter);
                if (subjectFilter) params.append('subject', subjectFilter);
                if (dateFilter) params.append('date', dateFilter);
                
                const response = await api.get(`/admin/performance/students?${params.toString()}`);
                
                // Handle the specific API response structure from the example
                if (response.data?.data?.students && Array.isArray(response.data.data.students)) {
                    setPerformanceData(response.data.data.students);
                    setTotalCount(response.data.data.pagination?.total || response.data.data.students.length);
                } else if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                    setPerformanceData(response.data.data.data);
                    setTotalCount(response.data.data.count || response.data.data.data.length);
                } else if (response.data?.data && Array.isArray(response.data.data)) {
                    setPerformanceData(response.data.data);
                    setTotalCount(response.data.count || response.data.data.length);
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setPerformanceData([]);
                    setTotalCount(0);
                }
            } catch (err) {
                console.error("Error fetching admin performance data:", err);
                setPerformanceData([]);
                setError(err.response?.data?.message || "Failed to fetch admin performance data");
            } finally {
                setLoading(false);
            }
        };

        fetchAdminPerformance();
    }, [page, itemsPerPage, searchQuery, classFilter, subjectFilter, dateFilter]);

    return { performanceData, totalCount, loading, error };
};

export default useFetchAdminPerformances;