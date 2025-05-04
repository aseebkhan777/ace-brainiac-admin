import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchMemberships from "../../hooks/useFetchMemberships";
import useDeleteMembership from "../../hooks/useDeleteMembership";
import { LoadingSpinner } from "../../components/Loader";

export default function MembershipsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [priceRange, setPriceRange] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [membershipToDelete, setMembershipToDelete] = useState(null);

    const navigate = useNavigate();
    
    const { memberships = [], loading, error, refetch } = useFetchMemberships();
    const { 
        deleteMembership, 
        deleteLoading, 
        deleteError, 
        deleteSuccess, 
        clearDeleteStatus 
    } = useDeleteMembership();
    
    const durationOptions = [
        { value: "30", label: "30 Days" },
        { value: "90", label: "90 Days" },
        { value: "180", label: "180 Days" },
        { value: "365", label: "365 Days" }
    ];

    const priceRangeOptions = [
        { value: "0-1000", label: "₹0 - ₹1,000" },
        { value: "1001-5000", label: "₹1,001 - ₹5,000" },
        { value: "5001-10000", label: "₹5,001 - ₹10,000" },
        { value: "10001-above", label: "₹10,001+" }
    ];
    
    const filteredMemberships = memberships.filter(membership => {
        // Search filter
        const matchesSearch = searchQuery === "" ||
            membership.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            membership.body.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Duration filter
        const matchesDuration = selectedDuration === "" || 
            membership.duration.toString() === selectedDuration;
        
        let matchesPrice = true;
        if (priceRange !== "") {
            const [min, max] = priceRange.split('-').map(Number);
            if (isNaN(max)) {
                matchesPrice = membership.price >= min;
            } else {
                matchesPrice = membership.price >= min && membership.price <= max;
            }
        }
        
        return matchesSearch && matchesDuration && matchesPrice;
    });

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredMemberships.length / itemsPerPage);
    const paginatedMemberships = filteredMemberships.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAddMembership = () => {
        navigate("/memberships/create");
    };

    const handleViewMembership = (membershipId) => {
        navigate(`/memberships/${membershipId}`);
    };

    const handleDeleteClick = (membership) => {
        setMembershipToDelete(membership);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!membershipToDelete) return;
        
        const result = await deleteMembership(membershipToDelete.id);
        if (result.success) {
            setShowDeleteConfirm(false);
            setMembershipToDelete(null);
            
            refetch();
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirm(false);
        setMembershipToDelete(null);
        clearDeleteStatus();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Memberships"
                    buttonText="+ Add Membership"
                    onButtonClick={handleAddMembership}
                >
                    <InnerCard
                        searchProps={{
                            value: searchQuery,
                            onChange: (e) => {
                                setSearchQuery(e.target.value);
                                setPage(1); 
                            },
                            placeholder: "Search memberships...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedDuration,
                            onChange: (e) => {
                                setSelectedDuration(e.target.value);
                                setPage(1);
                            },
                            label: "Duration",
                            options: durationOptions
                        }}
                        secondDropdownProps={{
                            value: priceRange,
                            onChange: (e) => {
                                setPriceRange(e.target.value);
                                setPage(1);
                            },
                            label: "Price Range",
                            options: priceRangeOptions
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Memberships State */}
                        {!loading && !error && paginatedMemberships.length === 0 && (
                            <div className="text-center py-4">No memberships found</div>
                        )}

                        {/* Memberships Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedMemberships.map((membership) => (
                                    <Card
                                        key={membership.id}
                                        height="h-[220px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold">{membership.title}</h3>
                                            <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                                {membership.duration} Days
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs line-clamp-2 mb-2">
                                                {membership.body}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Price:</span>
                                                <span className="text-green-700 font-medium">{formatPrice(membership.price)}</span>
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Duration:</span> {membership.duration} days
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Created:</span> {formatDate(membership.createdAt)}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Last Updated:</span> {formatDate(membership.updatedAt)}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-3">
                                            <Button
                                                variant="delete"
                                                className="mt-3 w-full text-xs"
                                                onClick={() => handleDeleteClick(membership)}
                                            >
                                                Delete
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

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && membershipToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
                        <p className="mb-6">Are you sure you want to delete the membership "{membershipToDelete.title}"? This action cannot be undone.</p>
                        
                        {deleteError && (
                            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                {deleteError}
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleCancelDelete}
                                disabled={deleteLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="delete"
                                onClick={handleConfirmDelete}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}