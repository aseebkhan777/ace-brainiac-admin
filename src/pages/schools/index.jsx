import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, School, MapPin, User } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchSchools from "../../hooks/useFetchSchools";
import useDeleteSchool from "../../hooks/useDeleteSchool";
import { LoadingSpinner } from "../../components/Loader";

export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [schoolToDelete, setSchoolToDelete] = useState(null);

    const { 
        schools = [], 
        loading, 
        error, 
        handleChangeParams, 
        params, 
        totalPages,
        refetch 
    } = useFetchSchools();

    const {
        deleteSchool,
        isDeleting,
        deleteError,
        deleteSuccess,
        resetDeleteState
    } = useDeleteSchool();

    // Handle delete confirmation
    const handleDeleteClick = (school) => {
        setSchoolToDelete(school);
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (schoolToDelete) {
            const success = await deleteSchool(schoolToDelete.id);
            if (success) {
                setShowDeleteConfirm(false);
                refetch();
            }
        }
    };

    const cancelDelete = () => {
        setShowDeleteConfirm(false);
        setSchoolToDelete(null);
        resetDeleteState();
    };

    // Clean up delete status on unmount
    useEffect(() => {
        return () => {
            resetDeleteState();
        };
    }, []);

    // Handle search
    const handleSearchChange = (e) => {
        handleChangeParams({ param: 'query', newValue: e.target.value });
    };

    // Handle status filter 
    const handleStatusChange = (e) => {
        const newValue = e.target.value;
        
        if (newValue === "ALL") {
            handleChangeParams({ param: 'status', newValue: null });
        } else {
            handleChangeParams({ param: 'status', newValue });
        }
    };

    // Handle date filter
    const handleDateChange = (date) => {
        handleChangeParams({ param: 'createDate', newValue: date });
    };

    // Handle pagination
    const handleNextPage = () => {
        const nextPage = page + 1;
        handleChangeParams({ param: 'page', newValue: nextPage });
        setPage(nextPage);
    };

    const handlePrevPage = () => {
        const prevPage = Math.max(1, page - 1);
        handleChangeParams({ param: 'page', newValue: prevPage });
        setPage(prevPage);
    };

    // Navigation
    const handleAddSchool = () => {
        navigate("/schools/create");
    };

    const handleViewSchool = (schoolId) => {
        navigate(`/schools/${schoolId}`);
    };

    // Status dropdown 
    const statusOptions = [
        { value: "ALL", label: "All" },
        { value: "ACTIVE", label: "Active" },
        { value: "IN_ACTIVE", label: "Inactive" },
        { value: "PENDING", label: "Pending" }
    ];

    const getStatusColorClasses = (status) => {
        switch (status) {
            case 'Active':
                return 'bg-green-100 text-green-800';
            case 'Suspended':
                return 'bg-yellow-100 text-yellow-800';
            case 'Blacklisted':
                return 'bg-red-100 text-red-800';
            case 'Pending':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Schools"
                    buttonText="+ Add School"
                    onButtonClick={handleAddSchool}
                >
                    <InnerCard
                        searchProps={{
                            value: params.query,
                            onChange: handleSearchChange,
                            placeholder: "Search schools...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: params.status || "ALL", 
                            onChange: handleStatusChange,
                            label: "Status",
                            options: statusOptions
                        }}
                        dateFilterProps={{
                            selectedDate: params.createDate,
                            onDateChange: handleDateChange,
                            label: "Date Filter"
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Schools State */}
                        {!loading && !error && schools.length === 0 && (
                            <div className="text-center py-4">
                                No schools found
                                <div className="mt-2">
                                    <Button variant="secondary" onClick={refetch}>
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Schools Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {schools.map((school) => (
                                    <Card
                                        key={school.id}
                                        height="h-[180px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold truncate">{school.schoolName}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorClasses(school.status === 'ACTIVE' ? 'Active' : (school.status === 'PENDING' ? 'Pending' : school.status))}`}>
                                                {school.status === 'ACTIVE' ? 'Active' : (school.status === 'PENDING' ? 'Pending' : school.status)}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs flex items-center">
                                                <MapPin size={12} className="mr-1 text-gray-500" />
                                                <span className="font-medium mr-2">Location:</span>
                                                {school.city}, {school.state}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <School size={12} className="mr-1 text-gray-500" />
                                                <span className="font-medium mr-2">Enrollment:</span>
                                                {school.enrollmentStrength || 'N/A'} students
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <User size={14} className="mr-1 text-gray-500" />
                                                <span className="font-medium mr-2">Principal:</span>
                                                {school.principalName || 'N/A'}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-3">
                                            <Button
                                                variant="secondary"
                                                className="mt-3 w-1/2 text-xs"
                                                onClick={() => handleViewSchool(school.id)}
                                            >
                                                View Details
                                            </Button>
                                            <Button
                                                variant="delete"
                                                className="mt-3 w-1/2 text-xs"
                                                onClick={() => handleDeleteClick(school)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        {schools.length > 0 && (
                            <div className="flex justify-center items-center gap-3 mt-5">
                                <Button
                                    variant="outline"
                                    onClick={handlePrevPage}
                                    disabled={page === 1}
                                    className="px-2 py-1"
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <span className="text-sm">{page} of {totalPages || 1}</span>
                                <Button
                                    variant="outline"
                                    onClick={handleNextPage}
                                    disabled={page >= totalPages}
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
                        <p>Are you sure you want to delete the school "{schoolToDelete?.schoolName}"?</p>
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