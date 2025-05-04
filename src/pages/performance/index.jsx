import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchAdminPerformances from "../../hooks/useFetchAdminPerformances";


export default function AdminPerformance() {
    const navigate = useNavigate();
    
   
    const { 
        performanceData, 
        loading, 
        error, 
        handleChangeParams, 
        params,
        totalPages,
        totalItems,
        refetch 
    } = useFetchAdminPerformances();

   
    const renderSubjectPills = (subjects) => {
        
        if (!subjects) return <span className="text-gray-500">No subjects</span>;
        
        
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
        { value: "", label: "All Subjects" },
        { value: "Science", label: "Science" },
        { value: "Math", label: "Math" },
        { value: "English", label: "English" },
        { value: "History", label: "History" }
    ];

    // Handle pagination
    const handleNextPage = () => {
        if (params.page < totalPages) {
            handleChangeParams({ param: 'page', newValue: params.page + 1 });
        }
    };

    const handlePrevPage = () => {
        if (params.page > 1) {
            handleChangeParams({ param: 'page', newValue: params.page - 1 });
        }
    };

    const navigateToStudentPerformance = (studentId) => {
        navigate(`/performance/${studentId}`);
    };

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex flex-col items-center justify-center bg-white">
                <OuterCard title="Admin Performance" className="w-full max-w-5xl">
                    <InnerCard
                        searchProps={{
                            value: params.query,
                            onChange: (e) => handleChangeParams({ param: 'query', newValue: e.target.value }),
                            placeholder: "Search students...",
                            showSearchIcon: true
                        }}
                        classDropdownProps={{
                            value: params.class,
                            onChange: (value) => handleChangeParams({ param: 'class', newValue: value }),
                            placeholder: "Filter by class...",
                            className: "bg-secondary",
                        }}
                        secondDropdownProps={{
                            value: params.subject,
                            onChange: (value) => handleChangeParams({ param: 'subject', newValue: value }),
                            label: "Subject",
                            options: subjectOptions
                        }}
                        dateFilterProps={{
                            selectedDate: params.date,
                            onDateChange: (date) => handleChangeParams({ param: 'date', newValue: date }),
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
                                <div className="mt-2">
                                    <Button variant="secondary" onClick={refetch}>
                                        Retry
                                    </Button>
                                </div>
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
                                    disabled={params.page === 1}
                                >
                                    <ChevronLeft />
                                </Button>
                                <span>
                                    {params.page} of {totalPages}
                                </span>
                                <Button
                                    variant="secondary"
                                    className="px-4 py-2 mx-2"
                                    onClick={handleNextPage}
                                    disabled={params.page === totalPages}
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