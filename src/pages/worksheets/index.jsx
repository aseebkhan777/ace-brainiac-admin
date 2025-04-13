import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, FileText, Download, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchWorksheets from "../../hooks/useFetchWorksheets";
import useDeleteWorksheet from "../../hooks/useDeleteWorksheet";

export default function WorksheetsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [worksheetList, setWorksheetList] = useState([]);

    const navigate = useNavigate();

    // Custom hooks
    const { worksheets, loading, error } = useFetchWorksheets();
    const { deleteWorksheet, deleteLoading, deleteError, deleteSuccess, clearDeleteStatus } = useDeleteWorksheet();

    // Update local state when worksheets are fetched
    useEffect(() => {
        if (worksheets) {
            setWorksheetList(worksheets);
        }
    }, [worksheets]);

    // Handle delete success/error messages
    useEffect(() => {
        if (deleteSuccess) {
            alert("Worksheet deleted successfully");
            // Update the local state to remove the deleted worksheet
            // This avoids having to refetch all worksheets
            clearDeleteStatus();
        }
        
        if (deleteError) {
            alert(`Error: ${deleteError}`);
            clearDeleteStatus();
        }
    }, [deleteSuccess, deleteError, clearDeleteStatus]);

    // Prepare dropdown options
    const subjectOptions = [
        { value: "Mathematics", label: "Mathematics" },
        { value: "Science", label: "Science" },
        { value: "English", label: "English" },
        { value: "Social Studies", label: "Social Studies" }
    ];

    const classOptions = [
        { value: "6th", label: "Class 6th" },
        { value: "7th", label: "Class 7th" },
        { value: "8th", label: "Class 8th" },
        { value: "9th", label: "Class 9th" },
        { value: "10th", label: "Class 10th" }
    ];

    // Filter worksheets based on search and dropdown filters
    const filteredWorksheets = worksheetList.filter(worksheet =>
        (searchQuery === "" ||
            worksheet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            worksheet.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (selectedSubject === "" || worksheet.subject === selectedSubject) &&
        (selectedClass === "" || worksheet.class === selectedClass)
    );

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredWorksheets.length / itemsPerPage);
    const paginatedWorksheets = filteredWorksheets.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAddWorksheet = () => {
        navigate("/worksheets/create");
    };

    const handleDownloadWorksheet = (fileUrl, title) => {
        // Create a function to handle worksheet downloads
        if (!fileUrl) {
            alert("Download link not available");
            return;
        }
        
        // Create a temporary anchor element to trigger download
        const anchor = document.createElement("a");
        anchor.href = fileUrl;
        anchor.download = `${title || "worksheet"}.pdf`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    };

    const handleDeleteWorksheet = async (worksheetId) => {
        if (window.confirm("Are you sure you want to delete this worksheet?")) {
            const result = await deleteWorksheet(worksheetId);
            
            if (result.success) {
                // Remove the worksheet from the local state
                setWorksheetList(prevWorksheets => 
                    prevWorksheets.filter(worksheet => worksheet.id !== worksheetId)
                );
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Worksheets"
                    buttonText="+ Add Worksheet"
                    onButtonClick={handleAddWorksheet}
                >
                    <InnerCard
                        searchProps={{
                            value: searchQuery,
                            onChange: (e) => setSearchQuery(e.target.value),
                            placeholder: "Search worksheets...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedSubject,
                            onChange: (e) => setSelectedSubject(e.target.value),
                            label: "Subject",
                            options: subjectOptions
                        }}
                        secondDropdownProps={{
                            value: selectedClass,
                            onChange: (e) => setSelectedClass(e.target.value),
                            label: "Class",
                            options: classOptions
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="text-center py-4">Loading worksheets...</div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Worksheets State */}
                        {!loading && !error && paginatedWorksheets.length === 0 && (
                            <div className="text-center py-4">No worksheets found</div>
                        )}

                        {/* Worksheets Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedWorksheets.map((worksheet) => (
                                    <Card
                                        key={worksheet.id}
                                        height="h-[220px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold truncate">{worksheet.title}</h3>
                                            <div className="flex gap-1">
                                                <Trash2 
                                                    size={16} 
                                                    className="text-red-500 cursor-pointer" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteWorksheet(worksheet.id);
                                                    }}
                                                />
                                               
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Subject:</span>{worksheet.subject}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Class:</span>{worksheet.class}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Created By:</span> {worksheet.createdBy}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Created At:</span> {worksheet.formattedCreatedAt}
                                            </p>
                                            <p className="text-xs line-clamp-2">
                                                <span className="font-medium">Description:</span> {worksheet.description}
                                            </p>
                                        </div>

                                        <div className="flex justify-between gap-2 mt-3">
                                            
                                            <Button
                                                variant="outline"
                                                className="mt-3 w-full text-xs flex justify-center items-center"
                                                onClick={() => handleDownloadWorksheet(worksheet.fileUrl, worksheet.title)}
                                                disabled={!worksheet.fileUrl}
                                            >
                                                <Download size={14} />
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
        </div>
    );
}