import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, FileText, CheckCircle, Loader, Trash2, Eye } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";

import useFetchTests from "../../hooks/useFetchTests";
import useCreateTest from "../../hooks/useCreateTests";
import useDeleteTest from "../../hooks/useDeteleTests";
import { LoadingSpinner } from "../../components/Loader";
import CreateTestModal from "../../components/TestModal";

export default function TestsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedCertification, setSelectedCertification] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState(null);

    const navigate = useNavigate();

    // Fetch tests using the custom hook
    const { tests = [], loading, error, fetchTests } = useFetchTests();
    // Add the createTest hook
    const { createTest, loading: creatingTest, error: createError } = useCreateTest();
    // Add the deleteTest hook
    const { deleteTest, loading: deletingTest, error: deleteError } = useDeleteTest();

    // Prepare dropdown options
    const statusOptions = [
        { value: "Draft", label: "Draft" },
        { value: "Published", label: "Published" },
    ];

    const certificationOptions = [
        { value: "true", label: "Available" },
        { value: "false", label: "Not Available" }
    ];

    // Filter tests based on search and dropdown filters
    const filteredTests = tests.filter(test => {
        // Basic filters (search, status, certification)
        const basicFiltersPassed = (
            (searchQuery === "" ||
                test.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                test.description?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (selectedStatus === "" || test.status === selectedStatus) &&
            (selectedCertification === "" ||
                (selectedCertification === "true" && test.certificationAvailable) ||
                (selectedCertification === "false" && !test.certificationAvailable))
        );

        // Date filter
        if (dateFilter && basicFiltersPassed) {
            const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
            const testDate = new Date(test.createdAt).setHours(0, 0, 0, 0);
            return testDate === filterDate;
        }

        return basicFiltersPassed;
    });

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
    const paginatedTests = filteredTests.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    // Modal handling
    const handleCreateTestClick = () => {
        setFormError(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormError(null);
    };

    const handleCreateTest = async (formData) => {
        try {
            console.log("Creating test with data:", formData);
            const testId = await createTest(formData);
            
            if (testId) {
                setIsModalOpen(false);
                navigate(`/tests/create/${testId}`);
            } else {
                setFormError("Failed to create test. Please try again.");
            }
        } catch (err) {
            console.error("Error creating test:", err);
            setFormError(err.message || "An error occurred while creating the test.");
        }
    };

    const handleViewTest = (testId) => {
        navigate(`/tests/create/${testId}`);
    };

    // Handle test deletion
    const handleDeleteTest = async (testId, e) => {
        if (e) e.stopPropagation(); // Prevent triggering other click events

        if (window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
            try {
                const success = await deleteTest(testId);
                if (success) {
                    // Refresh the tests list after successful deletion
                    fetchTests();
                }
            } catch (err) {
                console.error("Error deleting test:", err);
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Tests"
                    buttonText="+ Add Test"
                    onButtonClick={handleCreateTestClick}
                    buttonDisabled={creatingTest}
                    buttonLoading={creatingTest ? "Creating..." : null}
                >
                    <InnerCard
                        searchProps={{
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            placeholder: "Search tests...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedStatus,
                            onChange: (e) => setSelectedStatus(e.target.value),
                            label: "Status",
                            options: statusOptions
                        }}
                        secondDropdownProps={{
                            value: selectedCertification,
                            onChange: (e) => setSelectedCertification(e.target.value),
                            label: "Certification",
                            options: certificationOptions
                        }}
                        dateFilterProps={{
                            selectedDate: dateFilter,
                            onDateChange: setDateFilter,
                            label: "Creation Date"
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>}

                        {/* Error State */}
                        {(error || createError || deleteError) &&
                            <div className="text-red-500 text-center py-4">
                                {error || createError || deleteError}
                            </div>
                        }

                        {/* No Tests State */}
                        {!loading && !error && paginatedTests.length === 0 && (
                            <div className="text-center py-4">No tests found</div>
                        )}

                        {/* Tests Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedTests.map((test) => (
                                    <Card
                                        key={test.id}
                                        height="h-[220px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold truncate">{test.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${test.status === 'Published' ? 'bg-green-100 text-green-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {test.status}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            {/* Display class and subject as description */}
                                            <p className="text-xs flex items-center">
                                                <FileText size={12} className="mr-1 text-gray-500" />
                                                <span className="font-medium mr-2">Details:</span>
                                                <span className="truncate">{test.description || "No description"}</span>
                                            </p>

                                            {/* Display total marks */}
                                            <p className="text-xs">
                                                <span className="font-medium ml-3 mr-2">Total Marks:</span>
                                                {test.pass_percentage || "N/A"}
                                            </p>

                                            {/* Display certification availability */}
                                            <p className="text-xs flex items-center">
                                                <CheckCircle size={12} className="mr-1 text-gray-500" />
                                                <span className="font-medium mr-2">Certification:</span>
                                                {test.certificationAvailable ? "Available" : "Not Available"}
                                            </p>

                                            {/* Display question count */}
                                            <p className="text-xs">
                                                <span className="font-medium ml-3 mr-2">Questions:</span>
                                                {test.total_questions || "0"} questions
                                            </p>
                                        </div>

                                        {/* Creation Date */}
                                        <p className="text-xs text-gray-700 mt-1">
                                            Created: {test.createdAt ? new Date(test.createdAt).toLocaleDateString() : "Unknown date"}
                                        </p>

                                        <div className="flex justify-between gap-2 mt-3">
                                            <Button
                                                variant="secondary"
                                                className="mt-3 w-3/4 text-xs flex items-center justify-center gap-1"
                                                onClick={() => handleViewTest(test.id)}
                                            >
                                                <Eye size={14} /> View Details
                                            </Button>
                                            <Button
                                                variant="delete"
                                                className="mt-3 w-1/4 text-xs flex justify-center items-center"
                                                onClick={(e) => handleDeleteTest(test.id, e)}
                                                disabled={deletingTest}
                                            >
                                                <Trash2 size={16} />
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
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-2 py-1"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">{page} of {totalPages || 1}</span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-2 py-1"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </InnerCard>
                </OuterCard>
            </div>

            {/* Test Creation Modal */}
            <CreateTestModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleCreateTest}
                loading={creatingTest}
                error={formError}
            />
        </div>
    );
}