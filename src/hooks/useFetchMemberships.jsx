import { useState, useEffect, useRef, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchMemberships = () => {
    const [memberships, setMemberships] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    const fetchMemberships = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            requestMadeRef.current = true;
            const api = apiWithAuth();
            const response = await api.get("/admin/membership"); 
            console.log("Raw API response:", response.data);
            
            
            if (response.data?.data && Array.isArray(response.data.data)) {
                
                setMemberships(response.data.data);
                setTotalCount(response.data.data.length);
            } 
            else if (Array.isArray(response.data)) {
                // Direct array in response
                setMemberships(response.data);
                setTotalCount(response.data.length);
            }
            else if (response.data?.data?.memberships && Array.isArray(response.data.data.memberships)) {
                
                setMemberships(response.data.data.memberships);
                setTotalCount(response.data.data.count || response.data.data.memberships.length);
            } 
            else {
                console.warn("Unexpected API response structure:", response.data);
                setMemberships([]);
                setTotalCount(0);
            }
        } catch (err) {
            console.error("Error fetching memberships:", err);
            setMemberships([]);
            setError(err.response?.data?.message || "Failed to fetch memberships");
        } finally {
            setLoading(false);
        }
    }, []);

    
    useEffect(() => {
        if (requestMadeRef.current) return;
        fetchMemberships();
    }, [fetchMemberships]);

    
    const refetch = useCallback(() => {
        
        requestMadeRef.current = false;
        return fetchMemberships();
    }, [fetchMemberships]);

    return { memberships, totalCount, loading, error, refetch };
};

export default useFetchMemberships;