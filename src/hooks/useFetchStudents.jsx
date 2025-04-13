import { useState, useEffect, useRef } from "react";
import { apiWithAuth } from "../axios/Instance";

const useFetchStudents = () => {
    const [students, setStudents] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (requestMadeRef.current) return;
        
        const fetchStudents = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                const response = await api.get("/admin/student"); 
                console.log("Raw API response:", response.data);
                
                // Handle the response structure
                if (response.data?.data?.students && Array.isArray(response.data.data.students)) {
                    const studentsData = response.data.data.students.map(student => {
                        // Create a flattened student object with user properties at the top level
                        return {
                            // Student properties
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
                            
                            // User properties (flattened)
                            name: student.user?.name || "Unknown",
                            email: student.user?.email || "Not provided",
                            phone: student.user?.phone || "Not provided",
                            status: student.user?.status || "Unknown",
                            
                            // Formatted fields
                            formattedDob: new Date(student.dob).toLocaleDateString('en-GB', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
                            })
                        };
                    });
                    
                    setStudents(studentsData);
                    setTotalCount(response.data.data.count || studentsData.length);
                } else {
                    console.warn("Unexpected API response structure:", response.data);
                    setStudents([]);
                    setTotalCount(0);
                }
            } catch (err) {
                console.error("Error fetching students:", err);
                setStudents([]);
                setError(err.response?.data?.message || "Failed to fetch students");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    return { students, totalCount, loading, error };
};

export default useFetchStudents;