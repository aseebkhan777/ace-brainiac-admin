import { useState, useEffect, useCallback } from "react";
import { apiWithAuth } from "../axios/Instance";

const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const api = apiWithAuth();
      const response = await api.get("/persona/notifications");
      
      if (response.data && response.data.statusCode) {
        const { data } = response.data.statusCode;
        
        setNotifications(data.notifications || []);
        setUnreadCount(data.totalUnreadNotifications || 0);
        setTotalCount(data.totalNotifications || 0);
        
        return data.notifications;
      } else {
        setError("Invalid response structure");
        return [];
      }
    } catch (err) {
      console.error("Get notifications error:", err);
      setError(err.response?.data?.message || "Failed to fetch notifications");
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a specific notification as read
  const markAsRead = useCallback(async (notificationId) => {
    if (!notificationId) return false;
    
    try {
      const api = apiWithAuth();
      const response = await api.put(`/persona/notifications/${notificationId}`);
      
      if (response.data && response.data.statusCode && response.data.statusCode.status === 200) {
        // Update the local state
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId ? { ...notif, read: true } : notif
          )
        );
        // Recalculate unread count
        setUnreadCount(prev => Math.max(0, prev - 1));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Mark as read error:", err);
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const api = apiWithAuth();
      const response = await api.put("/persona/notifications");
      
      if (response.data && response.data.statusCode && response.data.statusCode.status === 200) {
        // Update all notifications to read in local state
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        // Reset unread count
        setUnreadCount(0);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Mark all as read error:", err);
      return false;
    }
  }, []);

  // Initial fetch of notifications
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return { 
    notifications, 
    unreadCount,
    totalCount,
    loading, 
    error, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead 
  };
};

export default useNotifications;