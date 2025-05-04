import React, { useState, useEffect, useCallback } from "react";
import OuterCard from "../../components/OuterCard";
import Table from "../../components/Table";
import ViewTicketModal from "../../components/ViewTicket";
import useAdminSupportTickets from "../../hooks/useSupportTickets";
import { ChevronLeft, ChevronRight } from "lucide-react";
import InnerCard from "../../components/InnerCard";

export default function AdminSupportTicketsPage() {
  const {
    tickets: ticketsData,
    loading,
    error,
    fetchTickets,
    totalCount,
    totalPages: apiTotalPages
  } = useAdminSupportTickets();

  const [currentPage, setCurrentPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [searchParams, setSearchParams] = useState({ query: "" });
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const itemsPerPage = 8; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchParams.query);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams.query]);

  // Load tickets when page changes or search query changes
  useEffect(() => {
    fetchTickets(currentPage, itemsPerPage, debouncedQuery);
  }, [currentPage, debouncedQuery, fetchTickets]);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedQuery]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchParams({ ...searchParams, query: e.target.value });
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchParams({ ...searchParams, query: "" });
  };

  // Fix for handling the API response structure
  const tickets = React.useMemo(() => {
    if (!ticketsData) return [];

    // Handle different possible response structures
    if (ticketsData.data && Array.isArray(ticketsData.data.tickets)) {
      return ticketsData.data.tickets;
    } else if (ticketsData.data && Array.isArray(ticketsData.data)) {
      return ticketsData.data;
    } else if (Array.isArray(ticketsData)) {
      return ticketsData;
    } else if (Array.isArray(ticketsData.tickets)) {
      return ticketsData.tickets;
    } else {
      return [];
    }
  }, [ticketsData]);

  const handleViewTicket = (ticket) => {
    setSelectedTicketId(ticket.id);
    setViewModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "-";

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now - date) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      }

      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
      }

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
      }

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
      }

      const diffInMonths = Math.floor(diffInDays / 30);
      if (diffInMonths < 12) {
        return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
      }

      const diffInYears = Math.floor(diffInMonths / 12);
      return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
    } catch (error) {
      return formatDate(dateString);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "OPEN":
      case "PENDING":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
      case "IN PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "RESOLVED":
        return "bg-gray-100 text-gray-800";
      case "CLOSED":
        return "bg-gray-200 text-gray-800";
      case "WAITING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Define columns for the table with render functions
  const columns = [
    {
      key: 'subject',
      label: 'Subject',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.subject}</span>
          <span className="text-xs text-gray-500">ID: {row.ticketId || row.id}</span>
        </div>
      )
    },
    {
      key: 'school',
      label: 'School',
      render: (row) => (
        <div>
          {row.schoolName}
        </div>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      render: (row) => (
        <div className="flex flex-col">
          <span>{formatDate(row.rawCreatedAt)}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(row.rawCreatedAt)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      )
    }
  ];

  // Transform the tickets data for the table component
  const transformedTickets = Array.isArray(tickets)
    ? tickets.map(ticket => {
      // Get school/organization name correctly from the user object
      const schoolName = ticket.user?.name || '-';

      return {
        id: ticket.id,
        subject: ticket.subject || "No Subject",
        school: schoolName,  // Match the column key
        schoolName: schoolName, // For the render function
        rawCreatedAt: ticket.createdAt,
        createdAt: formatDate(ticket.createdAt),
        status: ticket.status || "PENDING",
        ticketId: ticket.ticketId
      };
    })
    : [];

  // Handle page changes
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < apiTotalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Simplified Pagination component
  const SimplePagination = () => {
    return (
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-2 border rounded flex items-center justify-center ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm">
          {currentPage} of {apiTotalPages || 1}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage >= apiTotalPages}
          className={`px-3 py-2 border rounded flex items-center justify-center ${
            currentPage >= apiTotalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white hover:bg-gray-50 text-gray-700'
          }`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  };

  // Content to render based on loading/error state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-20 text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading support tickets...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-red-500 font-medium">Error loading tickets</p>
          <p className="text-gray-600 mt-1">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            onClick={() => fetchTickets(currentPage, itemsPerPage, debouncedQuery)}
          >
            Try Again
          </button>
        </div>
      );
    }

    if (transformedTickets.length === 0) {
      return (
        <div className="py-20 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <p className="text-gray-800 font-medium">No Support Tickets</p>
          <p className="text-gray-600 mt-1">
            {searchParams.query ? 
              `No tickets matching "${searchParams.query}"` : 
              "There are no support tickets to display"}
          </p>
          {searchParams.query && (
            <button
              className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              onClick={handleClearSearch}
            >
              Clear Search
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="w-full">
        <Table
          data={transformedTickets}
          columns={columns}
          onView={handleViewTicket}
          cardWidth="w-full"
          cardHeight="h-auto"
          buttonText="Manage"
          buttonVariant="primary"
          tableClassName="bg-white rounded-lg w-full"
          showViewButton={true}
          cardClassName="shadow-sm"
        />
        {totalCount > itemsPerPage && <SimplePagination />}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <OuterCard
        title="Support Tickets Management"
        subtitle="View and manage support tickets from all schools"
        className="w-full"
      >
        <InnerCard
          searchProps={{
            value: searchParams.query,
            onChange: handleSearchChange,
            placeholder: "Search tickets by subject, status, or school...",
            showSearchIcon: true,
            onClear: handleClearSearch
          }}
        >
          {renderContent()}
        </InnerCard>
      </OuterCard>

      {/* View/Update Ticket Modal */}
      <ViewTicketModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        ticketId={selectedTicketId}
        onSuccess={() => {
          fetchTickets(currentPage, itemsPerPage, debouncedQuery);
          setViewModalOpen(false);
        }}
      />
    </div>
  );
}