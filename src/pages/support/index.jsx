import React, { useState, useMemo } from "react";
import OuterCard from "../../components/OuterCard";
import Table from "../../components/Table";
import ViewTicketModal from "../../components/ViewTicket";

import { formatDistanceToNow } from "date-fns";
import useAdminSupportTickets from "../../hooks/useSupportTickets";

export default function AdminSupportTicketsPage() {
  const { tickets: ticketsData, loading, error, fetchTickets } = useAdminSupportTickets();
  
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

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
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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

  // Define columns for the table
  const columns = [
    { 
      key: 'subject', 
      label: 'Subject',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.subject}</span>
          <span className="text-xs text-gray-500">ID: {row.ticketId || row.id}</span>
        </div>
      ),
      width: "40%"
    },
    { 
      key: 'school', 
      label: 'School',
      render: (row) => (
        <div>
          {row.user?.name || row.sender?.name || '-'}
        </div>
      ),
      width: "20%"
    },
    { 
      key: 'createdAt', 
      label: 'Created', 
      render: (row) => (
        <div className="flex flex-col">
          <span>{formatDate(row.rawCreatedAt)}</span>
          <span className="text-xs text-gray-500">{formatTimeAgo(row.rawCreatedAt)}</span>
        </div>
      ),
      width: "20%"
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeClass(row.status)}`}>
          {row.status}
        </span>
      ),
      width: "20%"
    }
  ];

  // Transform the tickets data for the table component
  const tableData = Array.isArray(tickets)
    ? tickets.map(ticket => ({
        id: ticket.id,
        subject: ticket.subject || "No Subject",
        user: ticket.user, // Pass the full user object
        sender: ticket.sender, // Pass sender in case it exists
        rawCreatedAt: ticket.createdAt,
        createdAt: formatDate(ticket.createdAt),
        status: ticket.status || "PENDING",
        ticketId: ticket.ticketId
      }))
    : [];

  // Content to render based on loading/error state
  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-16 text-center">
          <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading support tickets...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <p className="text-red-500 font-medium">Error loading tickets</p>
          <p className="text-gray-600 mt-1">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            onClick={fetchTickets}
          >
            Try Again
          </button>
        </div>
      );
    }
    
    if (tableData.length === 0) {
      return (
        <div className="py-16 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <p className="text-gray-800 font-medium">No Support Tickets</p>
          <p className="text-gray-600 mt-1">There are no support tickets to display</p>
        </div>
      );
    }
    
    return (
      <Table
        data={tableData}
        columns={columns}
        onRowClick={handleViewTicket}
        onView={handleViewTicket} // Add onView handler to ensure the button works
        cardWidth="w-full"
        buttonText="Manage"
        buttonVariant="primary"
        tableClassName="bg-white rounded-lg w-full"
        showViewButtons={true}
        hoverable={true}
      />
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 p-6">
      <OuterCard
        title="Support Tickets Management"
        subtitle="View and manage support tickets from all schools"
      >
        {renderContent()}
      </OuterCard>

      {/* View/Update Ticket Modal */}
      <ViewTicketModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        ticketId={selectedTicketId}
        onSuccess={fetchTickets}
      />
    </div>
  );
}