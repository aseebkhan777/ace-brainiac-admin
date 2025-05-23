import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, FileText, CheckCircle, Eye, Trash2 } from "lucide-react";
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formError, setFormError] = useState(null);
    const navigate = useNavigate();

    
    const { 
        tests = [], 
        loading, 
        error, 
        handleChangeParams, 
        params, 
        totalPages,
        refetch 
    } = useFetchTests();

    
    const { createTest, loading: creatingTest, error: createError } = useCreateTest();
    
    const { deleteTest, loading: deletingTest, error: deleteError } = useDeleteTest();

    
    const statusOptions = [
        { value: "ALL", label: "All" },
        { value: "Draft", label: "Draft" },
        { value: "Published", label: "Published" },
    ];

    const certificationOptions = [
        { value: "true", label: "Available" },
        { value: "false", label: "Not Available" }
    ];

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

    // Handle certification filter
    const handleCertificationChange = (e) => {
        handleChangeParams({ param: 'certification', newValue: e.target.value });
    };

    // Handle date filter
    const handleDateChange = (date) => {
        handleChangeParams({ param: 'createDate', newValue: date });
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
        if (e) e.stopPropagation(); 

        if (window.confirm("Are you sure you want to delete this test? This action cannot be undone.")) {
            try {
                const success = await deleteTest(testId);
                if (success) {
                    
                    refetch();
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
                            value: params.query,
                            onChange: handleSearchChange,
                            placeholder: "Search tests...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: params.status || "ALL", 
                            onChange: handleStatusChange,
                            label: "Status",
                            options: statusOptions
                        }}
                        secondDropdownProps={{
                            value: params.certification,
                            onChange: handleCertificationChange,
                            label: "Certification",
                            options: certificationOptions
                        }}
                        dateFilterProps={{
                            selectedDate: params.createDate,
                            onDateChange: handleDateChange,
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
                        {!loading && !error && tests.length === 0 && (
                            <div className="text-center py-4">
                                No tests found
                                <div className="mt-2">
                                    <Button variant="secondary" onClick={refetch}>
                                        Retry
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Tests Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {tests.map((test) => (
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
                        {tests.length > 0 && (
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