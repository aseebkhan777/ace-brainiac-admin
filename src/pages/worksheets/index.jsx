import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, Trash2 } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchWorksheets from "../../hooks/useFetchWorksheets";
import useDeleteWorksheet from "../../hooks/useDeleteWorksheet";
import { LoadingSpinner } from "../../components/Loader";

export default function WorksheetsPage() {
    const navigate = useNavigate();

    
    const { 
        worksheets, 
        loading, 
        error, 
        handleChangeParams, 
        params, 
        totalPages,
        refetch 
    } = useFetchWorksheets();

    const { deleteWorksheet, deleteLoading, deleteError, deleteSuccess, clearDeleteStatus } = useDeleteWorksheet();

    
    useEffect(() => {
        if (deleteSuccess) {
            alert("Worksheet deleted successfully");
            
            refetch();
            clearDeleteStatus();
        }
        
        if (deleteError) {
            alert(`Error: ${deleteError}`);
            clearDeleteStatus();
        }
    }, [deleteSuccess, deleteError, clearDeleteStatus, refetch]);

  


    const handleAddWorksheet = () => {
        navigate("/worksheets/create");
    };

    const handleOpenWorksheet = (fileUrl, title) => {
        if (!fileUrl) {
            alert("Preview link not available");
            return;
        }
        
        
        window.open(fileUrl, '_blank');
    };

    const handleDeleteWorksheet = async (worksheetId) => {
        if (window.confirm("Are you sure you want to delete this worksheet?")) {
            await deleteWorksheet(worksheetId);
           
        }
    };

    // Handle search
    const handleSearchChange = (e) => {
        handleChangeParams({ param: 'query', newValue: e.target.value });
    };

    // Handle class filter
    const handleClassChange = (value) => {
        handleChangeParams({ param: 'class', newValue: value });
    };

    // Handle subject filter
    const handleSubjectChange = (value) => {
        handleChangeParams({ param: 'subject', newValue: value });
    };

    // Handle date filter
    const handleDateChange = (date) => {
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
                            value: params.query,
                            onChange: handleSearchChange,
                            placeholder: "Search worksheets...",
                            showSearchIcon: true
                        }}
                        subjectDropdownProps={{
                            value: params.subject,
                            onChange: handleSubjectChange,
                            placeholder: "Subject..",
                            className: "bg-secondary",
                            bgColor: "bg-secondary"
                        }}

                        classDropdownProps={{
                            value: params.class,
                            onChange: handleClassChange,
                            placeholder: "Class Filter..",
                            className: "bg-secondary"
                        }}
                        dateFilterProps={{
                            selectedDate: params.date,
                            onDateChange: handleDateChange,
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

                        {/* No Worksheets State */}
                        {!loading && !error && worksheets.length === 0 && (
                            <div className="text-center py-4">No worksheets found</div>
                        )}

                        {/* Worksheets Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {worksheets.map((worksheet) => (
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
                                                className="mt-3 w-full text-xs flex justify-center items-center gap-1"
                                                onClick={() => handleOpenWorksheet(worksheet.fileUrl, worksheet.title)}
                                                disabled={!worksheet.fileUrl}
                                            >
                                                <Download size={14} />
                                                <span>Open PDF</span>
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        {worksheets.length > 0 && (
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
        </div>
    );
}