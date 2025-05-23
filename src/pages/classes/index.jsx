import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchClasses from "../../hooks/useFetchClasses";
import useAddClass from "../../hooks/useAddClass";
import useDeleteClass from "../../hooks/useDeleteClass";
import AddClassModal from "../../components/modal";

export default function ClassesPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [itemsPerPage] = useState(6); 

    const navigate = useNavigate();

    
    const { classes = [], loading, error, pagination } = useFetchClasses(
        page, 
        searchQuery, 
        itemsPerPage, 
        refreshKey
    );

    // Add class hook
    const { addClass, loading: addLoading } = useAddClass();

    // Delete class hook
    const { deleteClass, loading: deleteLoading } = useDeleteClass();

   
    const handleSearchChange = (e) => {
        const value = e.target.value;
        
       
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

       
        setSearchQuery(value);
        
        // Debounce the API call
        const timeout = setTimeout(() => {
            
            setPage(1);
        }, 500); 
        
        setSearchTimeout(timeout);
    };

    const handleAddClass = () => {
        setIsModalOpen(true);
    };

    const handleAddClassSubmit = async (className) => {
        const result = await addClass(className);
        if (result) {
           
            setRefreshKey(prev => prev + 1);
        }
        return result;
    };

    const handleDeleteClass = async (classId) => {
        if (window.confirm("Are you sure you want to delete this class?")) {
            const result = await deleteClass(classId);
            if (result) {
                if (classes.length === 1 && page > 1) {
                    setPage(prev => prev - 1);
                } else {
                    
                    setRefreshKey(prev => prev + 1);
                }
            }
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Toast Container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Classes"
                    buttonText="+ Add Class"
                    onButtonClick={handleAddClass}
                >
                    <InnerCard
                        searchProps={{
                            value: searchQuery,
                            onChange: handleSearchChange,
                            placeholder: "Search classes...",
                            showSearchIcon: true
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="text-center py-4">Loading classes...</div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Classes State */}
                        {!loading && !error && classes.length === 0 && (
                            <div className="text-center py-4">No classes found</div>
                        )}

                        {/* Classes Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {classes.map((classItem) => (
                                    <Card
                                        key={classItem.id}
                                        height="h-[170px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold">Class {classItem.name}</h3>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Class ID:</span>
                                                <span className="text-gray-600">{classItem.id.substring(0, 8)}...</span>
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Created At:</span> {classItem.formattedCreatedAt}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Updated At:</span> {classItem.formattedUpdatedAt}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-3 mb-2">
                                            <Button
                                                variant="delete"
                                                className="mt-3 w-full text-xs flex items-center justify-center gap-1"
                                                onClick={() => handleDeleteClass(classItem.id)}
                                                disabled={deleteLoading}
                                            >
                                                <Trash2 size={14} /> Delete
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
                                disabled={!pagination.hasPreviousPage}
                                className="px-2 py-1"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">
                                {pagination.currentPage} of {pagination.totalPages || 1}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={!pagination.hasNextPage}
                                className="px-2 py-1"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </InnerCard>
                </OuterCard>
            </div>

            {/* Add Class Modal */}
            <AddClassModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddSuccess={handleAddClassSubmit}
            />
        </div>
    );
}