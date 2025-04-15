import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        // Only make the request if it hasn't been made already in this component lifecycle
        if (requestMadeRef.current) return;
        
        const fetchTests = async () => {
            setLoading(true);
            setError(null);
            
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get("/admin/test"); 
                
                if (response.data?.data && Array.isArray(response.data.data)) {
                    // Map response data to match the expected format in your UI
                    const testsData = response.data.data.map(test => ({
                        id: test.id,
                        name: test.title,
                        description: `${test.subject || ''} - ${test.class || ''}`,
                        status: test.status === "DRAFT" ? "Draft" : "Published",
                        certificationAvailable: test.certificationAvailable,
                        total_questions: test.questions?.length || 0,
                        duration: test.duration || null,
                        pass_percentage: test.pass_percentage || test.totalMarks,
                        created_by: test.created_by || "Admin",
                        createdAt: test.createdAt
                    }));
                    
                    setTests(testsData);
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setTests([]);
                }
            } catch (err) {
                console.error("Error fetching tests:", err);
                setError(err.response?.data?.message || "Failed to fetch tests");
            } finally {
                setLoading(false);
            }
        };
        
        fetchTests();
    }, []);

    return { tests, loading, error };
};

export default useFetchTests;