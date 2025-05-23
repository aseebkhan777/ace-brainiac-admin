import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchStudent = (studentId) => {
    const [student, setStudent] = useState({
        name: "",
        email: "",
        phone: "",
        gender: "",
        class: "",
        address: "",
        dob: "",
        formattedDob: "",
        createdAt: "",
        updatedAt: "",
        lastActive: "",
        status: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (!studentId || requestMadeRef.current) return;
        
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get(`/admin/student/${studentId}`);
                console.log("Raw API response:", response.data);
                
                // Directly access the data property from the response
                const apiData = response.data?.data || {};
                
                // Map API response to our expected structure
                // Merging data from both student and nested user object
                const studentData = {
                    // Fields from the top level student object
                    dob: apiData.dob || "",
                    formattedDob: apiData.dob ? new Date(apiData.dob).toLocaleDateString() : "",
                    gender: apiData.gender || "",
                    class: apiData.class || "",
                    address: apiData.address || "",
                    createdAt: apiData.createdAt || "",
                    updatedAt: apiData.updatedAt || "",
                    
                    // Fields from the nested user object
                    name: apiData.user?.name || "",
                    email: apiData.user?.email || "",
                    phone: apiData.user?.phone || "",
                    status: apiData.user?.status || "",
                    
                    // Additional fields
                    lastActive: apiData.lastActive || ""
                };
                
                console.log("Mapped student data:", studentData);
                setStudent(studentData);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError(err.response?.data?.message || "Failed to fetch student data");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [studentId]);

    const updateStudent = async (updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const api = apiWithAuth();
            
            // Split data between student and user fields based on API structure
            const studentFields = {
                dob: updatedData.dob,
                gender: updatedData.gender,
                class: updatedData.class,
                address: updatedData.address
            };
            
            const userFields = {
                name: updatedData.name,
                email: updatedData.email,
                phone: updatedData.phone,
                status: updatedData.status
            };
            
            // Combine into the structure expected by the API
            const editableData = {
                ...studentFields,
                user: userFields
            };
            
            console.log("Sending update data:", editableData);
            
            const response = await api.put(`/admin/student/${studentId}`, editableData);
            console.log("Update response:", response.data);
            
            // If update successful, keep our current mapped format
            if (response.data && response.data.data) {
                // Re-map the response to our expected structure to ensure consistency
                const apiData = response.data.data;
                const updatedStudentData = {
                    // Fields from the top level student object
                    dob: apiData.dob || updatedData.dob || "",
                    formattedDob: apiData.dob ? new Date(apiData.dob).toLocaleDateString() : "",
                    gender: apiData.gender || updatedData.gender || "",
                    class: apiData.class || updatedData.class || "",
                    address: apiData.address || updatedData.address || "",
                    createdAt: apiData.createdAt || updatedData.createdAt || "",
                    updatedAt: apiData.updatedAt || updatedData.updatedAt || "",
                    
                    // Fields from the nested user object
                    name: apiData.user?.name || updatedData.name || "",
                    email: apiData.user?.email || updatedData.email || "",
                    phone: apiData.user?.phone || updatedData.phone || "",
                    status: apiData.user?.status || updatedData.status || "",
                    
                    // Additional fields
                    lastActive: apiData.lastActive || updatedData.lastActive || ""
                };
                
                setStudent(updatedStudentData);
            } else {
                // If no data returned, keep the updated data
                setStudent(updatedData);
            }
            
            return { success: true };
        } catch (err) {
            console.error("Error updating student data:", err);
            setError(err.response?.data?.message || "Failed to update student data");
            return { 
                success: false, 
                error: err.response?.data?.message || "Failed to update student data" 
            };
        } finally {
            setLoading(false);
        }
    };

    return { student, setStudent, loading, error, updateStudent };
};

export default useFetchStudent;