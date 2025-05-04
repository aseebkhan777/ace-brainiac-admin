import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, School, MapPin, User } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchSchools from "../../hooks/useFetchSchools";
import { LoadingSpinner } from "../../components/Loader";

export default function SchoolsPage() {
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    const { 
        schools = [], 
        loading, 
        error, 
        handleChangeParams, 
        params, 
        totalPages,
        refetch 
    } = useFetchSchools();

   

    // Handle search
    const handleSearchChange = (e) => {
        handleChangeParams({ param: 'query', newValue: e.target.value });
    };

    // Handle status filter 
    const handleStatusChange = (e) => {
        handleChangeParams({ param: 'status', newValue: e.target.value });
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

    // Status dropdown options
    const statusOptions = [
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
                            value: params.status,
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
                                                className="mt-3 w-full text-xs"
                                                onClick={() => handleViewSchool(school.id)}
                                            >
                                                View Details
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
        </div>
    );
}