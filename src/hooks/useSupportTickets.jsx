import { useState, useEffect, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";


/**
 * Custom hook for managing admin support tickets
 * Provides functionality to fetch, view, update, and delete support tickets
 */
const useAdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch all support tickets
   */
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      const response = await api.get("/admin/support");
      
      // Handle different possible response structures
      if (response.data && response.data.data && Array.isArray(response.data.data.tickets)) {
        setTickets(response.data.data.tickets);
        return response.data.data.tickets;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setTickets(response.data.data);
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        setTickets(response.data);
        return response.data;
      } else if (response.data && Array.isArray(response.data.tickets)) {
        setTickets(response.data.tickets);
        return response.data.tickets;
      } else {
        setTickets([]);
        setError("Invalid response structure - no ticket data found");
        return [];
      }
    } catch (err) {
      console.error("Get admin support tickets error:", err);
      setError(err.response?.data?.message || "Failed to fetch support tickets");
      setTickets([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get a specific ticket by ID
   * @param {string} ticketId - The ID of the ticket to fetch
   * @returns {Promise<Object>} - The ticket data
   */
  const getTicketById = useCallback(async (ticketId) => {
    try {
      const api = apiWithAuth();
      const response = await api.get(`/admin/support/${ticketId}`);
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        // Handle case where data might be directly in response.data
        return response.data;
      }
      throw new Error("Invalid response structure");
    } catch (err) {
      console.error("Get ticket details error:", err);
      throw err;
    }
  }, []);

  /**
   * Update a ticket with resolution and status
   * @param {string} ticketId - The ID of the ticket to update
   * @param {Object} updateData - Data containing resolution and status
   * @returns {Promise<Object|boolean>} - The updated ticket or success indicator
   */
  const updateTicket = useCallback(async (ticketId, updateData) => {
    try {
      const api = apiWithAuth();
      const response = await api.put(`/admin/support/${ticketId}`, updateData);
      
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      }
      return true;
    } catch (err) {
      console.error("Update ticket error:", err);
      throw err;
    }
  }, []);

  /**
   * Delete a support ticket
   * @param {string} ticketId - The ID of the ticket to delete
   * @returns {Promise<boolean>} - Success indicator
   */
  const deleteTicket = useCallback(async (ticketId) => {
    try {
      const api = apiWithAuth();
      await api.delete(`/admin/support/${ticketId}`);
      return true;
    } catch (err) {
      console.error("Delete ticket error:", err);
      throw err;
    }
  }, []);

  // Fetch tickets on initial load
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return { 
    tickets, 
    loading, 
    error, 
    fetchTickets,
    getTicketById,
    updateTicket,
    deleteTicket
  };
};

export default useAdminSupportTickets;