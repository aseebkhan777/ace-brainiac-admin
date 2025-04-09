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
                
                // Handle the new response structure
                if (response.data?.data?.students && Array.isArray(response.data.data.students)) {
                    const studentsData = response.data.data.students.map(student => ({
                        ...student,
                        formattedDob: new Date(student.dob).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                        }),
                        formattedClass: student.class || "Not Specified"
                    }));
                    
                    setStudents(studentsData);
                    setTotalCount(response.data.data.total || studentsData.length);
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