import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchSchool = (schoolId) => {
    const [school, setSchool] = useState({
        id: "",
        schoolName: "",
        city: "",
        state: "",
        principalName: "",
        principalPhone: "",
        principalEmail: "",
        enrollmentStrength: 0,
        enrollmentStrengthType: "",
        status: "ACTIVE",
        coordinatorName: "",
        coordinatorEmail: "",
        coordinatorPhone: "",
        createdAt: "",
        updatedAt: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (!schoolId || requestMadeRef.current) return;
        
        const fetchSchoolData = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get(`/admin/schools/${schoolId}`);
                console.log("Raw API response:", response.data);
                
                // Directly access the data property from the response
                const apiData = response.data?.data || {};
                
                // Map API response to our expected structure, including coordinator info from user object
                const schoolData = {
                    id: apiData.id || "",
                    schoolName: apiData.schoolName || "",
                    city: apiData.city || "",
                    state: apiData.state || "",
                    principalName: apiData.principalName || "",
                    principalPhone: apiData.principalPhone || "",
                    principalEmail: apiData.principalEmail || "",
                    enrollmentStrength: apiData.enrollmentStrength || 0,
                    enrollmentStrengthType: apiData.enrollmentStrengthType || "",
                    status: apiData.status || "ACTIVE",
                    // Extract coordinator info from user object
                    coordinatorName: apiData.user?.name || "",
                    coordinatorEmail: apiData.user?.email || "",
                    coordinatorPhone: apiData.user?.phone || "",
                    createdAt: apiData.createdAt || "",
                    updatedAt: apiData.updatedAt || "",
                    // Store the whole user object for reference if needed
                    user: apiData.user || null
                };
                
                console.log("Mapped school data:", schoolData);
                setSchool(schoolData);
            } catch (err) {
                console.error("Error fetching school data:", err);
                setError(err.response?.data?.message || "Failed to fetch school data");
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolData();
    }, [schoolId]);

    const updateSchool = async (updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
            // Only send editable fields to the API
            const editableData = {
                principalName: updatedData.principalName,
                principalEmail: updatedData.principalEmail,
                enrollmentStrength: updatedData.enrollmentStrength.toString() // Convert to string as API expects
            };
            
            console.log("Sending update data:", editableData);
            
            const response = await api.put(`/admin/schools/${schoolId}`, editableData);
            console.log("Update response:", response.data);
            
            // If update successful, keep our current mapped format
            if (response.data && response.data.data) {
                // Re-map the response to our expected structure to ensure consistency
                const apiData = response.data.data;
                const updatedSchoolData = {
                    ...school, // Keep existing data
                    ...editableData, // Update with edited fields
                    // Make sure we preserve coordinator info
                    coordinatorName: apiData.user?.name || school.coordinatorName,
                    coordinatorEmail: apiData.user?.email || school.coordinatorEmail,
                    coordinatorPhone: apiData.user?.phone || school.coordinatorPhone,
                    updatedAt: apiData.updatedAt || new Date().toISOString() // Update the timestamp
                };
                
                setSchool(updatedSchoolData);
            } else {
                // If no data returned, keep the updated data
                setSchool({
                    ...school,
                    ...updatedData,
                    updatedAt: new Date().toISOString()
                });
            }
            
            return { success: true };
        } catch (err) {
            console.error("Error updating school data:", err);
            setError(err.response?.data?.message || "Failed to update school data");
            return { 
                success: false, 
                error: err.response?.data?.message || "Failed to update school data" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { school, setSchool, loading, error, updateSchool };
};

export default useFetchSchool;