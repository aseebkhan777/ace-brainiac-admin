import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OuterCard from '../../components/OuterCard';
import DetailsCard from '../../components/DetailsCard';
import UserGrowthChart from '../../components/LineChart';
import PlanDistributionChart from '../../components/DonutChart';
import Table from '../../components/Table';
import RecentlySubscribedMembers from '../../components/SubscribedMembers';
import useDashboardData from '../../hooks/useDashboardData';
import { LoadingSpinner } from '../../components/Loader';

export default function Dashboard() {
    const navigate = useNavigate();
    const { dashboardData, loading, error } = useDashboardData();
    const [testView, setTestView] = useState({
        showAll: false,
        count: 5
    });
    const [memberView, setMemberView] = useState({
        showAll: false,
        count: 5
    });
    
    const { stats, subscriptionDistribution, recentlyCreatedTests, recentlySubscribedMembers } = dashboardData || {};

    const formattedRecentTests = recentlyCreatedTests?.map(test => ({
        id: test.id,
        name: test.title,
        class: new Date(test.createdAt).toLocaleDateString()
    })) || [];

    const formattedSubscriptionData = Object.entries(subscriptionDistribution || {}).map(([name, value], index) => {
        const colors = ['text-red-500', 'text-blue-400', 'text-purple-500', 'text-green-500', 'text-yellow-500'];
        return {
            name,
            value,
            color: colors[index % colors.length]
        };
    });

    const formattedMembers = recentlySubscribedMembers?.map(member => ({
        id: member.id,
        name: member.user.email,
        role: 'Member',
        plan: member.membershipTitle,
        avatar: '/avatar.jpeg'
    })) || [];

    const handleViewTest = (item) => {
        navigate(`/tests/create/${item.id}`);
    };

    // Calculate total counts
    const totalTests = formattedRecentTests.length;
    const totalMembers = formattedMembers.length;

    // Handle test view toggle
    const toggleTestView = () => {
        setTestView(prev => ({
            showAll: !prev.showAll,
            count: prev.showAll ? 5 : formattedRecentTests.length
        }));
    };

    // Handle member view toggle
    const toggleMemberView = () => {
        setMemberView(prev => ({
            showAll: !prev.showAll,
            count: prev.showAll ? 5 : formattedMembers.length
        }));
    };

    // Calculate display counts based on current view state
    const displayedTests = formattedRecentTests.slice(0, testView.count);
    const displayedMembers = formattedMembers.slice(0, memberView.count);

    if (loading) {
        return (
            <OuterCard title="Dashboard" className="bg-gray-50">
                <div className="w-full h-96 flex items-center justify-center">
                    <LoadingSpinner size="default" color="#31473A" />
                </div>
            </OuterCard>
        );
    }

    if (error) {
        return (
            <OuterCard title="Dashboard" className="bg-gray-50">
                <div className="w-full h-96 flex items-center justify-center">
                    <p className="text-red-500">Error loading dashboard: {error}</p>
                </div>
            </OuterCard>
        );
    }

    const userGrowthData = [
        { month: '2025-01', users: stats?.students || 0 },
        { month: '2025-02', users: stats?.students || 0 },
        { month: '2025-03', users: stats?.students || 0 },
        { month: '2025-04', users: stats?.students || 0 },
        { month: '2025-05', users: stats?.students || 0 },
        { month: '2025-06', users: stats?.students || 0 },
        { month: '2025-07', users: stats?.students || 0 },
        { month: '2025-08', users: stats?.students || 0 },
        { month: '2025-09', users: stats?.students || 0 },
        { month: '2025-10', users: stats?.students || 0 },
        { month: '2025-11', users: stats?.students || 0 },
        { month: '2025-12', users: stats?.students || 0 },
    ];

    return (
        <OuterCard
            title="Dashboard"
            className="bg-gray-50"
        >
            <div className="w-full space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailsCard count={stats?.students || 0} label="Students" height="h-32" />
                    <DetailsCard count={stats?.schools || 0} label="Schools" height="h-32" />
                    <DetailsCard count={stats?.teachers || 0} label="Teachers" height="h-32" />
                    <DetailsCard count={stats?.totalTests || 0} label="Total Tests" height="h-32" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-9">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                        {userGrowthData.some(data => data.users > 0) ? (
                            <UserGrowthChart
                                data={userGrowthData}
                                title="Number of Users"
                                height="h-72"
                            />
                        ) : (
                            <div className="h-72 flex items-center justify-center">
                                <p className="text-gray-500">No user growth data available</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
                        {formattedSubscriptionData.length > 0 ? (
                            <PlanDistributionChart
                                data={formattedSubscriptionData}
                                title="Plan Distribution"
                                height="h-76"
                            />
                        ) : (
                            <div className="h-72 flex items-center justify-center">
                                <p className="text-gray-500">No subscription data available</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-9">
                    <div className="bg-white rounded-lg shadow p-4 ">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg">Recently Created Tests</h3>
                            {totalTests > 5 && (
                                <button 
                                    onClick={toggleTestView}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                                >
                                    {testView.showAll ? 'Show Less' : `See All (${totalTests})`}
                                </button>
                            )}
                        </div>
                        
                        {formattedRecentTests.length > 0 ? (
                            <div className={`${testView.showAll ? 'max-h-96 overflow-y-auto' : ''}`}>
                                <Table
                                    data={displayedTests}
                                    secondColumnName="Test Name"
                                    buttonText="View"
                                    buttonVariant="secondary"
                                    cardClassName="min-h-0"
                                    onView={handleViewTest}
                                />
                            </div>
                        ) : (
                            <div className="min-h-[200px] flex items-center justify-center">
                                <p className="text-gray-500">No recently created tests available</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-lg shadow p-4 overflow-hidden">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-lg">Recently Subscribed Members</h3>
                            {totalMembers > 5 && (
                                <button 
                                    onClick={toggleMemberView}
                                    type="button"
                                    className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                                >
                                    {memberView.showAll ? 'Show Less' : `See All (${totalMembers})`}
                                </button>
                            )}
                        </div>
                        
                        {formattedMembers.length > 0 ? (
                            <div className={`${memberView.showAll ? 'max-h-96 overflow-y-auto' : ''}`}>
                                <RecentlySubscribedMembers
                                    members={displayedMembers}
                                    maxItems={memberView.count}
                                    className="min-h-0"
                                />
                            </div>
                        ) : (
                            <div className="min-h-[200px] flex items-center justify-center">
                                <p className="text-gray-500">No recently subscribed members available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </OuterCard>
    );
}