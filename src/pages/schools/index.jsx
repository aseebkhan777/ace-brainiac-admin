import { useState } from "react";
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
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const navigate = useNavigate();

    // Fetch schools using the custom hook
    const { schools = [], loading, error, handleChangeParams, params } = useFetchSchools();

    // Prepare dropdown options with all available statuses
    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Suspended", label: "Suspended" },
        { value: "Blacklisted", label: "Blacklisted" },
        { value: "Pending", label: "Pending" }
    ];

    // Filter schools based on search and dropdown filters
    // Using user.status instead of school.status for filtering
    const filteredSchools = schools.filter(school =>
        (searchQuery === "" ||
            school.schoolName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            school.state?.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedType === "" || school.type === selectedType) &&
        (selectedStatus === "" || (school.user && school.user.status === selectedStatus))
    );

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredSchools.length / itemsPerPage);
    const paginatedSchools = filteredSchools.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAddSchool = () => {
        navigate("/schools/create");
    };

    const handleViewSchool = (schoolId) => {
        navigate(`/schools/${schoolId}`);
    };

    // Helper function to determine status color
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
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            placeholder: "Search schools...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedStatus,
                            onChange: (e) => setSelectedStatus(e.target.value),
                            label: "Status",
                            options: statusOptions
                        }}
                        dateFilterProps={{
                            selectedDate: selectedDate,
                            onDateChange: (date) => setSelectedDate(date),
                            label: "Date Filter"
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Schools State */}
                        {!loading && !error && paginatedSchools.length === 0 && (
                            <div className="text-center py-4">No schools found</div>
                        )}

                        {/* Schools Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedSchools.map((school) => (
                                    <Card
                                        key={school.id}
                                        height="h-[180px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold truncate">{school.schoolName}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColorClasses(school.user?.status || 'Unknown')}`}>
                                                {school.user?.status || 'Unknown'}
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
                        <div className="flex justify-center items-center gap-3 mt-5">
                            <Button
                                variant="outline"
                                onClick={() => handleChangeParams({param: 'limit', newValue: params.limit - 1})}
                                disabled={params.limit === 1}
                                className="px-2 py-1"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">{page} of {totalPages || 1}</span>
                            <Button
                                variant="outline"
                                onClick={() => handleChangeParams({param: 'limit', newValue: params.limit + 1})}
                                disabled={params.offset > 100}
                                className="px-2 py-1"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </InnerCard>
                </OuterCard>
            </div>
        </div>
    );
}