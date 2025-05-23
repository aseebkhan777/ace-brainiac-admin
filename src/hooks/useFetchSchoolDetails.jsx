import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiWithAuth } from "../axios/Instance";
import { toast } from "react-toastify";

const useFetchSchoolDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [schoolDetails, setSchoolDetails] = useState({
        schoolName: "Unknown",
        location: "Unknown",
        membershipType: "Unknown",
        expiryDate: "Unknown",
        status: "ACTIVE", // Default status
        counts: {
            students: 0,
            worksheets: 0,
            tests: 0
        }
    });
    const [worksheets, setWorksheets] = useState([]);
    const [tests, setTests] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const requestMadeRef = useRef(false);

    useEffect(() => {
        if (!id || requestMadeRef.current) return;
        
        const fetchSchoolData = async () => {
            setLoading(true);
            setError(null);
            try {
                requestMadeRef.current = true;
                const api = apiWithAuth();
                // Use the consolidated endpoint that returns all data
                const response = await api.get(`/admin/schools/details/${id}`);
                
                // Extract all school data from the API
                const apiData = response.data?.data || {};
                const recentData = apiData.recentData || {};
                const statistics = apiData.statistics || {};
                const subscriptionDetails = recentData.subscriptionDetails || {};
                
                // Format expiry date
                const expiryDate = new Date(subscriptionDetails.expiryDate);
                const formattedExpiryDate = expiryDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });

                // Extract school status - assuming it's in the user object
                const status = apiData.user?.status || "ACTIVE";

                // Map API response to our expected structure
                setSchoolDetails({
                    schoolName: apiData.schoolName || "Unknown",
                    location: `${apiData.city || "Unknown"}, ${apiData.state || ""}`.trim(),
                    membershipType: subscriptionDetails.subscriptionPlan || "Unknown",
                    expiryDate: formattedExpiryDate || "Unknown",
                    status: status,
                    counts: {
                        students: statistics.studentCount || 0,
                        worksheets: statistics.worksheetCount || 0,
                        tests: statistics.testCount || 0
                    }
                });
                
                // Process worksheets data
                const worksheetData = recentData.worksheets || [];
                setWorksheets(worksheetData);
                
                // Process tests data
                const testData = recentData.tests || [];
                setTests(testData);
                
                // Process student data
                const studentData = recentData.students || [];
                setStudents(studentData);
                
            } catch (err) {
                console.error("Error fetching school data:", err);
                setError(err.response?.data?.message || "Failed to fetch school data");
                toast.error("Failed to fetch school data");
            } finally {
                setLoading(false);
            }
        };

        fetchSchoolData();
    }, [id]);

    // Function to reload school data after status change
    const reloadSchoolData = async () => {
        try {
            setLoading(true);
            const api = apiWithAuth();
            const response = await api.get(`/admin/schools/details/${id}`);
            
            // Update the school details state with the new data
            const apiData = response.data?.data || {};
            const status = apiData.user?.status || "ACTIVE";
            
            setSchoolDetails(prevDetails => ({
                ...prevDetails,
                status: status
            }));
        } catch (err) {
            console.error("Error reloading school data:", err);
            setError(err.response?.data?.message || "Failed to reload school data");
            toast.error("Failed to reload school data");
        } finally {
            setLoading(false);
        }
    };

    // Event handlers
    const handleSuspend = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/schools/suspend/${id}`);
            
            // Update local state
            setSchoolDetails(prevDetails => ({
                ...prevDetails,
                status: "SUSPENDED"
            }));
            
            // Show success toast
            toast.success("School suspended successfully");
        } catch (err) {
            console.error("Error suspending school:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to suspend school");
        }
    };

    const handleActivate = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/schools/active/${id}`);
            
            // Update local state
            setSchoolDetails(prevDetails => ({
                ...prevDetails,
                status: "ACTIVE"
            }));
            
            // Show success toast
            toast.success("School activated successfully");
        } catch (err) {
            console.error("Error activating school:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to activate school");
        }
    };

    const handleApprove = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/schools/approve/${id}`);
            
            // Update local state
            setSchoolDetails(prevDetails => ({
                ...prevDetails,
                status: "ACTIVE"
            }));
            
            // Show success toast
            toast.success("School approved successfully");
        } catch (err) {
            console.error("Error approving school:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to approve school");
        }
    };

    const handleBlacklist = async () => {
        try {
            const api = apiWithAuth();
            await api.patch(`/admin/schools/blacklist/${id}`);
            
            // Update local state
            setSchoolDetails(prevDetails => ({
                ...prevDetails,
                status: "BLACKLISTED"
            }));
            
            // Show success toast
            toast.success("School blacklisted successfully");
        } catch (err) {
            console.error("Error blacklisting school:", err);
            // Show error toast
            toast.error(err.response?.data?.message || "Failed to blacklist school");
        }
    };

    const handleEdit = () => {
        // Use the navigate function correctly
        navigate(`/schools/edit/${id}`);
    };

    return {
        schoolDetails,
        worksheets,
        tests,
        students,
        loading,
        error,
        handleSuspend,
        handleActivate,
        handleApprove,
        handleBlacklist,
        handleEdit
    };
};

export default useFetchSchoolDetails;