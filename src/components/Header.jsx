import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline } from "react-icons/io";
import { FiSettings, FiCheck } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import useNotifications from "../hooks/useNotifications"; // Import the hook

const Header = () => {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [atTop, setAtTop] = useState(true);
    
    // Notifications state
    const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
    const notificationsPanelRef = useRef(null);
    
    // Use our custom notifications hook
    const { 
        notifications, 
        unreadCount, 
        loading, 
        error, 
        fetchNotifications, 
        markAsRead, 
        markAllAsRead 
    } = useNotifications();

    // Control header visibility based on scroll direction
    const controlHeader = useCallback(() => {
        // Get the proper scroll position - either from window or from the main content element
        const mainContent = document.querySelector('main.flex-1.overflow-auto');
        const currentScrollY = mainContent ? mainContent.scrollTop : window.scrollY;
        
        // Check if at top
        if (currentScrollY <= 0) {
            setVisible(true);
            setAtTop(true);
        } else {
            setAtTop(false);
            
            if (currentScrollY > lastScrollY) {
                // Hide when scrolling down
                setVisible(false);
            } else {
                // Show when scrolling up
                setVisible(true);
            }
        }
        
        // Update scroll position
        setLastScrollY(currentScrollY);
    }, [lastScrollY]);

    useEffect(() => {
        // Find the scrollable element - either window or the main content
        const scrollElement = document.querySelector('main.flex-1.overflow-auto') || window;
        
        // Add scroll event listener to the proper element
        scrollElement.addEventListener("scroll", controlHeader);
        
        // Clean up event listener
        return () => {
            scrollElement.removeEventListener("scroll", controlHeader);
        };
    }, [controlHeader]);

    // Handle notification panel clicks outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationsPanelRef.current && 
                !notificationsPanelRef.current.contains(event.target) &&
                !event.target.closest('.notifications-button')
            ) {
                setShowNotificationsPanel(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format date for notifications
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 60) {
            return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
            return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
        } else if (diffDays < 7) {
            return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
        } else {
            return date.toLocaleDateString();
        }
    };

    // Handle notification click
    const handleNotificationClick = async (notification) => {
        if (!notification.read) {
            await markAsRead(notification.id);
        }
        
        // Navigate to the relevant page based on notification type
        if (notification.link) {
            navigate(notification.link);
            setShowNotificationsPanel(false);
        }
    };

    return (
        <div 
            className={`flex justify-end items-center fixed top-0 left-0 w-full z-50 transition-all duration-300 py-3 px-6 ${
                !visible ? "transform -translate-y-full" : "transform-none"
            } ${
                atTop ? "bg-transparent" : "bg-white shadow-md"
            }`}
        >
            {/* Icon Container - Keeps all in one line */}
            <div className="flex items-center gap-4">
                {/* Notification Icon with Badge */}
                <div className="relative flex items-center justify-center h-12 w-12">
                    <button 
                        className="notifications-button text-primary hover:text-black"
                        onClick={() => setShowNotificationsPanel(!showNotificationsPanel)}
                    >
                        <IoMdNotificationsOutline size={30} />
                    </button>
                    {/* Notification badge with count */}
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </div>

                {/* Notifications Panel */}
                {showNotificationsPanel && (
                    <div 
                        ref={notificationsPanelRef}
                        className="absolute top-16 right-4 w-80 max-h-96 bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-3 border-b border-gray-200">
                            <h3 className="font-semibold">Notifications</h3>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                                    disabled={unreadCount === 0}
                                >
                                    <FiCheck className="mr-1" size={14} />
                                    Mark all read
                                </button>
                                <button 
                                    onClick={() => setShowNotificationsPanel(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <MdClose size={18} />
                                </button>
                            </div>
                        </div>
                        
                        {/* Notifications Content */}
                        <div className="overflow-y-auto max-h-80">
                            {loading ? (
                                <div className="flex justify-center items-center h-24">
                                    <p className="text-gray-500">Loading...</p>
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex justify-center items-center h-24">
                                    <p className="text-gray-500">No notifications</p>
                                </div>
                            ) : (
                                <ul>
                                    {notifications.map((notification) => (
                                        <li 
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                                !notification.read ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium mb-1">{notification.title}</p>
                                                <p className="text-xs text-gray-600 mb-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        
                        {/* Footer */}
                        <div className="p-2 text-center border-t border-gray-200">
                            <button 
                                onClick={() => {
                                    navigate('/notifications');
                                    setShowNotificationsPanel(false);
                                }}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                View all notifications
                            </button>
                        </div>
                    </div>
                )}

                {/* Profile Image */}
                <div className="h-10 w-10">
                    <img
                        src="/avatar.jpeg"
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;