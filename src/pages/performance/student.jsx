import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useAdminStudentPerformance from "../../hooks/useAdminStudentPerformance";



export default function AdminStudentPerformance() {
    const { id } = useParams(); // Get student ID from URL params
    const navigate = useNavigate();
    
    const [search, setSearch] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // For API calls
    const [page, setPage] = useState(1);
    const [subject, setSubject] = useState("");
    const [suspendLoading, setSuspendLoading] = useState(false);
    const [notification, setNotification] = useState(null);
    const itemsPerPage = 9;
    
    // Using the hook to fetch student data and tests
    const { 
        student, 
        tests, 
        stats, 
        totalPages, 
        loading, 
        testsLoading,
        error, 
        testsError,
        suspendStudent
    } = useAdminStudentPerformance(id, page, itemsPerPage, searchQuery, subject);

    // Handle search form submission
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(search);
        setPage(1); // Reset to first page when searching
    };

    // Handle subject filter change
    const handleSubjectChange = (value) => {
        setSubject(value);
        setPage(1); // Reset to first page when changing filters
    };

    // Open file in new tab
    const handleFileAccess = (fileUrl, fileName) => {
        if (!fileUrl) {
            showNotification("File URL is not available", "error");
            return;
        }
        
        // Open the file URL in a new tab
        window.open(fileUrl, '_blank');
    };

    // Handle student suspension
    const handleSuspendStudent = async () => {
        if (window.confirm("Are you sure you want to suspend this student?")) {
            setSuspendLoading(true);
            const result = await suspendStudent();
            setSuspendLoading(false);
            
            if (result.success) {
                showNotification(result.message, "success");
                // Optionally navigate back or refresh data
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
            } else {
                showNotification(result.message, "error");
            }
        }
    };

    // Show notification
    const showNotification = (message, type) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    if (loading && !student) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Loading student data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-red-50 p-6 rounded-lg max-w-md">
                    <p className="text-red-600 mb-4">Error: {error}</p>
                    <Button 
                        variant="default" 
                        onClick={() => window.location.reload()}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-white">
            {/* Notification */}
            {notification && (
                <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md z-50 max-w-sm ${
                    notification.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {notification.message}
                </div>
            )}
            
            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center">
                <OuterCard title="Admin Student Performance">
                    {/* Student Info */}
                    {student && (
                        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md flex flex-col sm:flex-row items-center sm:justify-between mb-6 w-full">
                            <div className="flex flex-col sm:flex-row items-center gap-4">
                                <img 
                                    src={student.avatar || "/avatar.jpeg"} 
                                    alt={student.name} 
                                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full" 
                                />
                                <div className="text-center sm:text-left">
                                    <h2 className="text-lg sm:text-xl font-semibold">{student.name}</h2>
                                    <p>Class: {student.class}</p>
                                    <p>Address: {student.address}</p>
                                    <p>Status: <span className={
                                        student.status === "Active" ? "text-green-600" : "text-red-600"
                                    }>{student.status}</span></p>
                                </div>
                            </div>
                            <Button 
                                variant="default" 
                                className="bg-red-200 text-red-700 mt-4 sm:mt-0"
                                onClick={handleSuspendStudent}
                                disabled={suspendLoading || student.status !== "Active"}
                            >
                                {suspendLoading ? 'Processing...' : 'Suspend'}
                            </Button>
                        </div>
                    )}

                    {/* Overall Performance */}
                    <div className="bg-white p-4 sm:p-6 mb-4 rounded-lg shadow-sm w-full">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                            {[
                                { title: "Tests Taken", value: stats.totalTests },
                                { title: "Average Score", value: stats.averageScore },
                                { title: "Top Score", value: stats.topScore }
                            ].map((item, index) => (
                                <div key={index} className="relative bg-primary p-6 rounded-lg shadow-lg text-center text-white overflow-hidden">
                                    <svg className="absolute bottom-0 left-0 w-full" width="252" height="86" viewBox="0 0 252 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M65.5 44C41.9 36.8 5.33333 70.6667 -10 88.5L48.5 108.5L275.5 104.5L284 26.5C278.5 22.5 260.6 12.1 233 2.50004C198.5 -9.49996 164 34 152 44C140 54 95 53 65.5 44Z" fill="url(#paint0_linear_361_2891)" />
                                        <defs>
                                            <linearGradient id="paint0_linear_361_2891" x1="120.5" y1="20.5" x2="137" y2="108.5" gradientUnits="userSpaceOnUse">
                                                <stop stopColor="white" stopOpacity="0.23" />
                                                <stop offset="1" stopColor="white" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <div className="pb-4">
                                        <h3 className="text-lg font-semibold relative z-10">{item.title}</h3>
                                        <p className="text-3xl font-bold relative z-10">{item.value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <InnerCard
                        searchProps={{
                            value: search,
                            onChange: (e) => setSearch(e.target.value),
                            placeholder: "Search tests...",
                            showSearchIcon: true,
                            onSubmit: handleSearch
                        }}
                        firstDropdownProps={{
                            value: subject,
                            onChange: handleSubjectChange,
                            label: "Subject",
                            options: [
                                { value: "", label: "All Subjects" },
                                { value: "English", label: "English" },
                                { value: "Science", label: "Science" },
                                { value: "Math", label: "Math" }
                            ]
                        }}
                        secondDropdownProps={{
                            value: "all",
                            onChange: () => {},
                            label: "Status",
                            options: [
                                { value: "all", label: "All" },
                                { value: "completed", label: "Completed" },
                                { value: "pending", label: "Pending" }
                            ]
                        }}
                    >
                        {testsLoading && (
                            <div className="flex justify-center items-center p-10">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {!testsLoading && testsError && (
                            <div className="text-center py-10">
                                <p className="text-red-500">{testsError}</p>
                                <Button 
                                    variant="link" 
                                    className="mt-2"
                                    onClick={() => window.location.reload()}
                                >
                                    Retry
                                </Button>
                            </div>
                        )}

                        {!testsLoading && !testsError && tests.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-gray-500">No tests found</p>
                                {searchQuery && (
                                    <Button 
                                        variant="link" 
                                        className="mt-2"
                                        onClick={() => {
                                            setSearch("");
                                            setSearchQuery("");
                                            setSubject("");
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* Test Cards */}
                        {!testsLoading && !testsError && tests.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {tests.map((test, index) => (
                                    <div key={index} className="bg-white border border-primary p-4 hover:shadow-md transition-shadow relative">
                                        <div 
                                            className="cursor-pointer"
                                            onClick={() => navigate(`/admin/test-details/${test.id}`)}
                                        >
                                            <h3 className="text-xl font-semibold pb-2">{test.title}</h3>
                                            <span className="bg-primary text-white px-2 py-1 text-xs rounded">{test.subject}</span>
                                            <p className="mt-2 font-semibold">{test.questions} Questions</p>
                                            <p>Score: {test.score}</p>
                                            {test.date && <p className="text-gray-500 text-sm mt-2">{new Date(test.date).toLocaleDateString()}</p>}
                                        </div>
                                        
                                        {/* File Access Button */}
                                        {test.fileUrl && (
                                            <Button
                                                variant="ghost"
                                                className="absolute top-2 right-2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFileAccess(test.fileUrl, test.title);
                                                }}
                                                title="Download Certificate"
                                            >
                                                <ExternalLink size={16} />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination - only show if there are tests */}
                        {!testsLoading && tests.length > 0 && totalPages > 1 && (
                            <div className="flex justify-center items-center mt-6">
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 mx-2"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span>{page} of {totalPages}</span>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 mx-2"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    <ChevronRight />
                                </Button>
                            </div>
                        )}
                    </InnerCard>
                </OuterCard>
            </div>
        </div>
    );
}