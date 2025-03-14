import React, { useState } from "react";
import {
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Home,
    Users,
    Settings,
    HelpCircle,
    BarChart2,
} from "lucide-react";
import { Outlet } from "react-router-dom";

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [activeLink, setActiveLink] = useState("dashboard");
    const [expandedGroups, setExpandedGroups] = useState({
        analytics: false,
        settings: false,
    });

    const iconMap = {
        home: Home,
        users: Users,
        settings: Settings,
        help: HelpCircle,
        chart: BarChart2,
    };

    const sidebarLinks = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "home",
            path: "/dashboard",
        },
        {
            id: "users",
            label: "Users",
            icon: "users",
            path: "/users",
        },
        {
            id: "analytics",
            label: "Analytics",
            icon: "chart",
            isGroup: true,
            children: [
                {
                    id: "reports",
                    label: "Reports",
                    path: "/analytics/reports",
                },
                {
                    id: "statistics",
                    label: "Statistics",
                    path: "/analytics/statistics",
                },
                {
                    id: "performance",
                    label: "Performance",
                    path: "/analytics/performance",
                },
            ],
        },
        {
            id: "settings",
            label: "Settings",
            icon: "settings",
            isGroup: true,
            children: [
                {
                    id: "profile",
                    label: "Profile",
                    path: "/settings/profile",
                },
                {
                    id: "security",
                    label: "Security",
                    path: "/settings/security",
                },
            ],
        },
        {
            id: "help",
            label: "Help & Support",
            icon: "help",
            path: "/help",
        },
    ];

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const toggleGroup = (groupId) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const handleLinkClick = (linkId) => {
        setActiveLink(linkId);
    };

    // Render sidebar links recursively
    const renderLinks = (links, level = 0) => {
        return links.map((link) => {
            const IconComponent = iconMap[link.icon];

            if (link.isGroup) {
                const isExpanded = expandedGroups[link.id];
                return (
                    <div key={link.id} className="mb-1">
                        <button
                            onClick={() => toggleGroup(link.id)}
                            className={`flex items-center w-full px-4 py-2 text-left transition-colors rounded-md hover:bg-gray-700 ${
                                isOpen ? "" : "justify-center"
                            }`}
                        >
                            {IconComponent && (
                                <span className="mr-3">
                                    <IconComponent size={20} />
                                </span>
                            )}
                            {isOpen && (
                                <>
                                    <span className="flex-grow">
                                        {link.label}
                                    </span>
                                    {isExpanded ? (
                                        <ChevronDown size={16} />
                                    ) : (
                                        <ChevronRight size={16} />
                                    )}
                                </>
                            )}
                        </button>
                        {isOpen && isExpanded && (
                            <div className="ml-4 mt-1 space-y-1">
                                {renderLinks(link.children, level + 1)}
                            </div>
                        )}
                    </div>
                );
            }

            return (
                <button
                    key={link.id}
                    onClick={() => handleLinkClick(link.id)}
                    className={`flex items-center w-full px-4 py-2 mb-1 rounded-md transition-colors ${
                        activeLink === link.id
                            ? "bg-blue-600 text-white"
                            : "text-gray-300 hover:bg-gray-700"
                    } ${isOpen ? "" : "justify-center"}`}
                >
                    {IconComponent && (
                        <span className={isOpen ? "mr-3" : ""}>
                            <IconComponent size={20} />
                        </span>
                    )}
                    {isOpen && <span>{link.label}</span>}
                </button>
            );
        });
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`bg-gray-800 text-white transition-all duration-300 flex flex-col ${
                    isOpen ? "w-64" : "w-16"
                } md:relative fixed h-full z-10`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b border-gray-700">
                    {isOpen && <h1 className="text-xl font-bold">App Name</h1>}
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md hover:bg-gray-700"
                    >
                        {isOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Sidebar Content */}
                <div className="flex-grow p-3 overflow-y-auto">
                    <nav>{renderLinks(sidebarLinks)}</nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-gray-700">
                    {isOpen ? (
                        <div className="text-sm text-gray-400">
                            Logged in as:{" "}
                            <span className="font-semibold">Admin</span>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Users size={20} />
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content */}
           <Outlet />
        </div>
    );
};

export default Sidebar;
