import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    // Define fetchTests outside useEffect so it can be returned
    const fetchTests = async () => {
        setLoading(true);
        setError(null);
        
        try {
            const api = apiWithAuth();
            const response = await api.get("/admin/test"); 
            
            if (response.data?.data && Array.isArray(response.data.data)) {
                // Map response data to match the expected format in your UI
                const testsData = response.data.data.map(test => ({
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

    useEffect(() => {
        // Only make the request if it hasn't been made already
        if (!requestMadeRef.current) {
            requestMadeRef.current = true;
            fetchTests();
        }
    }, []);

    // Return the fetchTests function along with the other data
    return { tests, loading, error, fetchTests };
};

export default useFetchTests;