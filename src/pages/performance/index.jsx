import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchAdminPerformances from "../../hooks/useFetchAdminPerformances";


export default function AdminPerformance() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [subjectFilter, setSubjectFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    
    // Use the custom hook to fetch data
    const { 
        performanceData, 
        totalCount, 
        loading, 
        error 
    } = useFetchAdminPerformances(
        currentPage,
        itemsPerPage,
        searchQuery,
        selectedClass,
        subjectFilter,
        dateFilter
    );

    // Calculate total pages based on the total count from the API
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    // Handle debounced search
    const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchQuery(debouncedSearch);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [debouncedSearch]);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const navigateToStudentPerformance = (studentId) => {
        navigate(`/performance/${studentId}`);
    };

    // Helper function to render subject pills
    const renderSubjectPills = (subjects) => {
        // If subject is a string, convert to array
        if (!subjects) return <span className="text-gray-500">No subjects</span>;
        
        // If subject is a string, convert to array, otherwise use as is if it's already an array
        const subjectArray = typeof subjects === 'string' ? [subjects] : Array.isArray(subjects) ? subjects : [];
        
        return (
            <div className="flex overflow-x-auto pb-2 mt-2 gap-2">
                {subjectArray.map((subject, idx) => (
                    <span 
                        key={idx} 
                        className="whitespace-nowrap bg-primary text-white text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                        {subject}
                    </span>
                ))}
            </div>
        );
    };

    // Subject options
    const subjectOptions = [
        { value: "Science", label: "Science" },
        { value: "Math", label: "Math" },
        { value: "English", label: "English" },
        { value: "History", label: "History" }
    ];

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
                <OuterCard title="Admin Performance" className="w-full max-w-5xl">
                    <InnerCard
                        searchProps={{
                            value: debouncedSearch,
                            onChange: (e) => setDebouncedSearch(e.target.value),
                            placeholder: "Search students...",
                            showSearchIcon: true
                        }}
                        classDropdownProps={{
                            value: selectedClass,
                            onChange: (value) => {
                                setSelectedClass(value);
                                setCurrentPage(1); // Reset to first page when filtering
                            },
                            placeholder: "Filter by class...",
                            className: "bg-secondary",
                        }}
                        secondDropdownProps={{
                            value: subjectFilter,
                            onChange: (value) => {
                                setSubjectFilter(value);
                                setCurrentPage(1);
                            },
                            label: "Subject",
                            options: subjectOptions
                        }}
                        dateFilterProps={{
                            value: dateFilter,
                            onChange: (e) => {
                                setDateFilter(e.target.value);
                                setCurrentPage(1);
                            },
                            label: "Date"
                        }}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center text-red-500 p-4">
                                {error}
                            </div>
                        ) : performanceData.length === 0 ? (
                            <div className="text-center p-4">
                                No performance data found. Try adjusting your filters.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {performanceData.map((student, index) => (
                                    <div key={index} className="bg-secondary p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold">{student.name}</h3>
                                        <p>Class: {student.class}</p>
                                        
                                        {/* Subject Pills Section with horizontal scroll */}
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-600">Subjects:</p>
                                            {renderSubjectPills(student.subjects || student.subject)}
                                        </div>
                                        
                                        <p className="mt-2">Date: {new Date(student.createdAt).toLocaleDateString()}</p>
                                        <Button 
                                            variant="secondary" 
                                            className="mt-3 w-full"
                                            onClick={() => navigateToStudentPerformance(student.studentId)}
                                        >
                                            View Details
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {!loading && performanceData.length > 0 && (
                            <div className="flex justify-center items-center mt-6">
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 mx-2"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span>
                                    {currentPage} of {totalPages}
                                </span>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 mx-2"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
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