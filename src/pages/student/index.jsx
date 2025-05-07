import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchStudents from "../../hooks/useFetchStudents";
import useDeleteStudent from "../../hooks/useDeleteStudent";
import { LoadingSpinner } from "../../components/Loader";

export default function StudentsPage() {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState(null);
    
    const { 
        students = [], 
        loading, 
        error, 
        handleChangeParams, 
        params, 
        totalPages,
        refetch 
    } = useFetchStudents();

    const {
        deleteStudent,
        isDeleting,
        deleteError,
        deleteSuccess,
        resetDeleteState
    } = useDeleteStudent();

    // Handle delete confirmation
    const handleDeleteClick = (student) => {
        setStudentToDelete(student);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (studentToDelete) {
            const success = await deleteStudent(studentToDelete.id);
            if (success) {
                setShowDeleteConfirm(false);
                refetch();
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setStudentToDelete(null);
        resetDeleteState();
    };

    // Clean up delete status on unmount
    useEffect(() => {
        return () => {
            resetDeleteState();
        };
    }, []);
   
    const statusOptions = [
        { value: "All", label: "All" },
        { value: "active", label: "Active" },
        { value: "pending", label: "Pending" },
        { value: "inactive", label: "Inactive" }
    ];

    // Handle search
    const handleSearchChange = (e) => {
        handleChangeParams({ param: 'query', newValue: e.target.value });
    };

    // Handle class filter
    const handleClassChange = (value) => {
        handleChangeParams({ param: 'class', newValue: value });
    };

    // Handle status filter 
    const handleStatusChange = (event) => {
        const statusValue = event && event.target ? event.target.value : null;
        console.log("Status value:", statusValue);
        
        if (statusValue === "All") {
            handleChangeParams({ param: 'status', newValue: '' });
        } else {
            handleChangeParams({ param: 'status', newValue: statusValue });
        }
    };
    
    const handleCreatedDateChange = (date) => {
        handleChangeParams({ param: 'date', newValue: date });
    };

    // Handle pagination
    const handleNextPage = () => {
        const nextPage = params.page + 1;
        handleChangeParams({ param: 'page', newValue: nextPage });
    };

    const handlePrevPage = () => {
        const prevPage = Math.max(1, params.page - 1);
        handleChangeParams({ param: 'page', newValue: prevPage });
    };

    const handleAddStudent = () => {
        navigate("/students/create");
    };

    const handleViewStudent = (studentId) => {
        navigate(`/students/${studentId}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Students"
                    buttonText="+ Add Student"
                    onButtonClick={handleAddStudent}
                >
                    <InnerCard
                        searchProps={{
                            value: params.query,
                            onChange: handleSearchChange,
                            placeholder: "Search students...",
                            showSearchIcon: true
                        }}
                        classDropdownProps={{
                            value: params.class,
                            onChange: handleClassChange,
                            placeholder: "Filter by class..."
                        }}
                        firstDropdownProps={{
                            value: params.status || "All",
                            onChange: handleStatusChange,
                            label: "Status",
                            options: statusOptions
                        }}
                        dateFilterProps={{
                            selectedDate: params.date,
                            onDateChange: handleCreatedDateChange,
                            label: "Created Date"
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>}

                        {/* Error State */}
                        {error && (
                            <div className="text-red-500 text-center py-4">
                                {error}
                                <div className="mt-2">
                                    <Button variant="secondary" onClick={refetch}>
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* No Students State */}
                        {!loading && !error && students.length === 0 && (
                            <div className="text-center py-4">No students found</div>
                        )}

                        {/* Students Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {students.map((student) => (
                                    <Card
                                        key={student.id}
                                        height="h-[220px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold">{student.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                student.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                                student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {student.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Gender:</span>{student.gender}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Class:</span>{student.class}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Email:</span> {student.email}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Date of Birth:</span> {student.formattedDob}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Created:</span> {student.formattedCreatedAt}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Phone:</span> {student.phone || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-3">
                                            <Button
                                                variant="secondary"
                                                className="mt-3 w-1/2 text-xs"
                                                onClick={() => handleViewStudent(student.id)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="delete"
                                                className="mt-3 w-1/2 text-xs"
                                                onClick={() => handleDeleteClick(student)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        {students.length > 0 && (
                            <div className="flex justify-center items-center gap-3 mt-5">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevPage}
                                    disabled={params.page === 1}
                                    className="px-2 py-1"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <span className="text-sm">{params.page} of {totalPages || 1}</span>
                                <Button
                                    variant="outline"
                                    onClick={handleNextPage}
                                    disabled={params.page >= totalPages}
                                    className="px-2 py-1"
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        )}
                    </InnerCard>
                </OuterCard>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
                        <p>Are you sure you want to delete the student "{studentToDelete?.name}"?</p>
                        {deleteError && (
                            <div className="mt-2 text-red-500 text-sm">{deleteError}</div>
                        )}
                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="outline" onClick={cancelDelete} disabled={isDeleting}>
                                Cancel
                            </Button>
                            <Button variant="delete" onClick={confirmDelete} disabled={isDeleting}>
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}