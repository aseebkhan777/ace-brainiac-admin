import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiWithAuth } from "../axios/Instance";
import { toast } from "react-toastify";

const useFetchStudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studentDetails, setStudentDetails] = useState({
        fullName: "Unknown",
        address:"Unknown",
        email: "Unknown",
        class: "Unknown",
        schoolName: "Unknown",
        joinDate: "Unknown",
        status: "Active", // Default status (matching API's capitalization)
        counts: {
            tests: 0,
            certificates: 0
        }
    });
    const [certificates, setCertificates] = useState([]);
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (!id || requestMadeRef.current) return;
        
        const fetchStudentData = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                // Use the consolidated endpoint that returns all data
                const response = await api.get(`/admin/student/details/${id}`);
                
                // Extract all student data from the API
                const apiData = response.data?.data || {};
                const student = apiData.student || {};
                const user = student.user || {};
                const statistics = apiData.statistics || {};
                const tests = apiData.tests || {};
                
                // Format join date
                const joinDate = new Date(student.createdAt);
                const formattedJoinDate = joinDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Map API response to our expected structure
                setStudentDetails({
                    fullName: user.name || "Unknown", // This will correctly get the user name
                    email: user.email || "Unknown",
                    address: student.address || "Unknown",
                    class: student.class || "Unknown",
                    schoolName: "Unknown", // School name is not directly available in the API response
                    joinDate: formattedJoinDate || "Unknown",
                    status: user.status || "Active",
                    counts: {
                        tests: statistics.givenTestsCount || 0,
                        certificates: statistics.certificateCount || 0
                    }
                });
                
                // Process certificates data - currently empty in the API response
                setCertificates([]);
                
                // Process tests data
                const allTests = tests.allTests || [];
                const certificationTests = tests.certificationTests || [];
                setTests([...allTests, ...certificationTests]);
                
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError(err.response?.data?.message || "Failed to fetch student data");
                toast.error("Failed to fetch student data");
            } finally {
                setLoading(false);
            }
        };

        fetchStudentData();
    }, [id]);

    // Function to reload student data after status change
    const reloadStudentData = async () => {
        try {
            setLoading(true);
            const api = apiWithAuth();
            const response = await api.get(`/admin/student/details/${id}`);
            
            // Update the student details state with the new data
            const apiData = response.data?.data || {};
            const student = apiData.student || {};
            const user = student.user || {};
            
            setStudentDetails(prevDetails => ({
                ...prevDetails,
                status: user.status || "Active"
            }));
        } catch (err) {
            console.error("Error reloading student data:", err);
            setError(err.response?.data?.message || "Failed to reload student data");
            toast.error("Failed to reload student data");
        } finally {
            setLoading(false);
        }
    };

    // Event handlers
    const handleSuspend = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/student/suspend/${id}`);
            
            // Update local state
            setStudentDetails(prevDetails => ({
                ...prevDetails,
                status: "Suspended" // Match API capitalization
            }));
            
            // Show success toast
            toast.success("Student suspended successfully");
        } catch (err) {
            console.error("Error suspending student:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to suspend student");
        }
    };

    const handleActivate = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/student/activate/${id}`);
            
            // Update local state
            setStudentDetails(prevDetails => ({
                ...prevDetails,
                status: "Active" // Match API capitalization
            }));
            
            // Show success toast
            toast.success("Student activated successfully");
        } catch (err) {
            console.error("Error activating student:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to activate student");
        }
    };

    const handleBlacklist = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/student/blacklist/${id}`);
            
            // Update local state
            setStudentDetails(prevDetails => ({
                ...prevDetails,
                status: "Blacklisted" // Match API capitalization
            }));
            
            // Show success toast
            toast.success("Student blacklisted successfully");
        } catch (err) {
            console.error("Error blacklisting student:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to blacklist student");
        }
    };

    const handleEdit = () => {
        navigate(`/students/edit/${id}`);
    };

    return {
        studentDetails,
        certificates,
        tests,
        loading,
        error,
        handleSuspend,
        handleActivate,
        handleBlacklist,
        handleEdit
    };
};

export default useFetchStudentDetails;