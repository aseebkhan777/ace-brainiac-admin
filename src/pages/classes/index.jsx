import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchClasses from "../../hooks/useFetchClasses";

export default function ClassesPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    // Fetch classes using the custom hook
    const { classes = [], loading, error } = useFetchClasses();

    // Filter classes based on search
    const filteredClasses = classes.filter(classItem =>
        searchQuery === "" || 
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
    const paginatedClasses = filteredClasses.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAddClass = () => {
        navigate("/classes/create");
    };

    const handleViewClass = (classId) => {
        // Navigate to the class details page with the ID as a URL parameter
        navigate(`/classes/${classId}`);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">

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
                            onChange: (e) => setSearchQuery(e.target.value),
                            placeholder: "Search classes...",
                            showSearchIcon: true
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="text-center py-4">Loading classes...</div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Classes State */}
                        {!loading && !error && paginatedClasses.length === 0 && (
                            <div className="text-center py-4">No classes found</div>
                        )}

                        {/* Classes Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedClasses.map((classItem) => (
                                    <Card
                                        key={classItem.id}
                                        height="h-[220px]"
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

                                        <div className="flex justify-center gap-2 mt-3">
                                            <Button
                                                variant="secondary"
                                                className="mt-3 w-full text-xs"
                                                onClick={() => handleViewClass(classItem.id)}
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