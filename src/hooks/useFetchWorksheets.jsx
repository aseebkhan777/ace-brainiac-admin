import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchWorksheets = () => {
    const [worksheets, setWorksheets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (requestMadeRef.current) return;
        
        const fetchWorksheets = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get("/admin/worksheet");
                console.log("Raw API response:", response.data);
                
                // Correctly access the nested data array
                if (response.data?.data?.data && Array.isArray(response.data.data.data)) {
                    const worksheetsData = response.data.data.data.map(worksheet => {
                        return {
                            id: worksheet.id,
                            title: worksheet.title || "Untitled Worksheet",
                            description: worksheet.description || "No description",
                            subject: worksheet.subject || "N/A",
                            class: worksheet.class || "N/A",
                            createdBy: worksheet.createdBy || "Unknown",
                            createdAt: worksheet.createdAt,
                            updatedAt: worksheet.updatedAt,
                            fileUrl: worksheet.pdfUrl || "", // Note: using pdfUrl from the API instead of fileUrl
                            
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
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setWorksheets([]);
                }
            } catch (err) {
                console.error("Error fetching worksheets:", err);
                setWorksheets([]);
                setError(err.response?.data?.message || "Failed to fetch worksheets");
            } finally {
                setLoading(false);
            }
        };

        fetchWorksheets();
    }, []);

    return { worksheets, loading, error };
};

export default useFetchWorksheets;