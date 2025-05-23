import { useState, useEffect, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";


const useAdminSupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  /**
   
   * @param {number} page - The page number to fetch (defaults to 1)
   * @param {number} limit - Number of items per page (defaults to 10)
   * @param {string} query - Search query for filtering tickets (optional)
   */
  const fetchTickets = useCallback(async (page = 1, limit = 10, query = "") => {
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      
      const offset = (page - 1) * limit;
      
      
      const params = {
        offset,
        limit
      };
      
     
      if (query && query.trim() !== "") {
        params.query = query.trim();
      }
      
      const response = await api.get("/admin/support", { params });
      
      
      let ticketsData = [];
      let total = 0;
      
      if (response.data && response.data.data) {
        if (Array.isArray(response.data.data.tickets)) {
          ticketsData = response.data.data.tickets;
          total = response.data.data.total || response.data.data.count || ticketsData.length;
        } else if (Array.isArray(response.data.data)) {
          ticketsData = response.data.data;
          total = response.data.meta?.total || response.data.meta?.count || ticketsData.length;
        }
      } else if (Array.isArray(response.data)) {
        ticketsData = response.data;
        total = ticketsData.length;
      } else if (response.data && Array.isArray(response.data.tickets)) {
        ticketsData = response.data.tickets;
        total = response.data.total || response.data.count || ticketsData.length;
      } else {
        setError("Invalid response structure - no ticket data found");
        ticketsData = [];
        total = 0;
      }
      
      const pages = Math.ceil(total / limit);
      
      setTickets(ticketsData);
      setTotalCount(total);
      setTotalPages(pages);
      
      return {
        tickets: ticketsData,
        totalCount: total,
        totalPages: pages,
        currentPage: page
      };
    } catch (err) {
      console.error("Get admin support tickets error:", err);
      setError(err.response?.data?.message || "Failed to fetch support tickets");
      setTickets([]);
      setTotalCount(0);
      setTotalPages(0);
      return {
        tickets: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page
      };
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

  

  return { 
    tickets, 
    loading, 
    error, 
    totalCount,
    totalPages,
    fetchTickets,
    getTicketById,
    updateTicket,
    deleteTicket
  };
};

export default useAdminSupportTickets;