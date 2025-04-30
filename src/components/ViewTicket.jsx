import React, { useState, useEffect } from "react";

import toast from "react-hot-toast";
import Button from "./Button";

import Modal from "./TicketModal";
import useAdminSupportTickets from "../hooks/useSupportTickets";

const ViewTicketModal = ({ isOpen, onClose, ticketId, onSuccess }) => {
  const { getTicketById, updateTicket, deleteTicket } = useAdminSupportTickets();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resolution, setResolution] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  // Fetch ticket details when the modal opens and ticketId changes
  useEffect(() => {
    if (isOpen && ticketId) {
      fetchTicketDetails();
    }
  }, [isOpen, ticketId]);

  const fetchTicketDetails = async () => {
    if (!ticketId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const ticketData = await getTicketById(ticketId);
      setTicket(ticketData);
      
      // Pre-fill the resolution field if available
      if (ticketData.resolution) {
        setResolution(ticketData.resolution);
      } else {
        setResolution("");
      }
      
      // Set the current status
      setStatus(ticketData.status || "PENDING");
    } catch (err) {
      console.error("Get ticket details error:", err);
      setError(err.response?.data?.message || "Failed to fetch ticket details");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTicket = async () => {
    if (!ticketId) return;
    
    setUpdateLoading(true);
    setError(null);
    
    try {
      const payload = {
        resolution,
        status
      };
      
      await updateTicket(ticketId, payload);
      
      toast.success("Ticket updated successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Update ticket error:", err);
      setError(err.response?.data?.message || "Failed to update ticket");
      toast.error("Failed to update ticket");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!ticketId) return;
    
    // Ask for confirmation before deleting
    if (!window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      await deleteTicket(ticketId);
      
      toast.success("Ticket deleted successfully");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Delete ticket error:", err);
      toast.error(err.response?.data?.message || "Failed to delete ticket");
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Support Ticket"
      size="lg"
    >
      {loading ? (
        <div className="text-center py-8">Loading ticket details...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : ticket ? (
        <div className="space-y-4">
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-1">{ticket.subject}</h3>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              Ticket ID: {ticket.ticketId || ticket.id} • Created: {formatDate(ticket.createdAt)}
            </div>
            <div className="text-sm text-gray-600 mt-1">
              School: {ticket.sender?.name || ticket.user?.name || '-'} • 
              Submitted By: {ticket.sender?.email || ticket.user?.email || '-'}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Description</h4>
            <p className="whitespace-pre-wrap">{ticket.concern || ticket.description || "No description provided"}</p>
          </div>

          {ticket.attachment && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Attachment</h4>
              <a
                href={ticket.attachment}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline flex items-center"
              >
                View Attachment
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  ></path>
                </svg>
              </a>
            </div>
          )}

          {/* Multiple attachments handling */}
          {ticket.attachments && ticket.attachments.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Attachments</h4>
              <div className="flex flex-wrap gap-2">
                {ticket.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    {attachment.name || `File ${index + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}

          {ticket.responses && ticket.responses.length > 0 && (
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Responses</h4>
              <div className="space-y-4">
                {ticket.responses.map((response, index) => (
                  <div key={index} className="bg-white border rounded-lg p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{response.responderName || "Support Team"}</span>
                      <span className="text-sm text-gray-500">{formatDate(response.createdAt)}</span>
                    </div>
                    <p className="text-gray-700">{response.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolution section - Admin only */}
          <div className="bg-white border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Resolution</h4>
            <textarea
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              placeholder="Enter resolution details..."
            />
          </div>

          {/* Status update - Admin only */}
          <div className="bg-white border border-blue-200 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Update Status</h4>
            <select
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>

          <div className="flex justify-between pt-4 border-t mt-6">
            <Button
              variant="delete"
              onClick={handleDeleteTicket}
              disabled={deleteLoading}
              className="flex items-center"
            >
              {deleteLoading ? "Deleting..." : "Delete Ticket"}
            </Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleUpdateTicket}
                disabled={updateLoading}
                className="bg-primary text-white hover:bg-hover"
              >
                {updateLoading ? "Updating..." : "Update Ticket"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">No ticket data found</div>
      )}
    </Modal>
  );
};

export default ViewTicketModal;