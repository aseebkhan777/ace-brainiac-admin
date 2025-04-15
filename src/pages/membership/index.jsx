import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchMemberships from "../../hooks/useFetchMemberships";

export default function MembershipsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDuration, setSelectedDuration] = useState("");
    const [priceRange, setPriceRange] = useState("");

    const navigate = useNavigate();

    // Fetch memberships using the custom hook
    const { memberships = [], loading, error } = useFetchMemberships();

    // Prepare dropdown options
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

    // Filter memberships based on search and dropdown filters
    // Filter memberships based on search and dropdown filters
const filteredMemberships = memberships.filter(membership => {
    // Search filter
    const matchesSearch = searchQuery === "" ||
        membership.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        membership.body.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Duration filter
    const matchesDuration = selectedDuration === "" || 
        membership.duration.toString() === selectedDuration;
    
    // Price range filter
    let matchesPrice = true;
    if (priceRange !== "") {
        const [min, max] = priceRange.split('-').map(Number);
        if (isNaN(max)) {
            // For "10001-above" case
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
        // Navigate to the membership details page with the ID as a URL parameter
        navigate(`/memberships/${membershipId}`);
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
                                setPage(1); // Reset to first page when searching
                            },
                            placeholder: "Search memberships...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedDuration,
                            onChange: (e) => {
                                setSelectedDuration(e.target.value);
                                setPage(1); // Reset to first page when filtering
                            },
                            label: "Duration",
                            options: durationOptions
                        }}
                        secondDropdownProps={{
                            value: priceRange,
                            onChange: (e) => {
                                setPriceRange(e.target.value);
                                setPage(1); // Reset to first page when filtering
                            },
                            label: "Price Range",
                            options: priceRangeOptions
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="text-center py-4">Loading memberships...</div>}

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
                                                variant="secondary"
                                                className="mt-3 w-full text-xs"
                                                onClick={() => handleViewMembership(membership.id)}
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