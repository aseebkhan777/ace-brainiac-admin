import React from 'react';
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

    // Fetch real data from API
    const { dashboardData, loading, error } = useDashboardData();

    // Extract real data
    const { stats, recentlyCreatedTests } = dashboardData;

    // Sample data for user growth chart (kept as dummy data)
    const userGrowthData = [
        { month: '2023-01', users: 500 },
        { month: '2023-02', users: 550 },
        { month: '2023-03', users: 580 },
        { month: '2023-04', users: 800 },
        { month: '2023-05', users: 1050 },
        { month: '2023-06', users: 1200 },
        { month: '2023-07', users: 1500 },
        { month: '2023-08', users: 1700 },
        { month: '2023-09', users: 2000 },
        { month: '2023-10', users: 2300 },
        { month: '2023-11', users: 2600 },
        { month: '2023-12', users: 3000 },
    ];

    // Sample data for plan distribution chart (kept as dummy data)
    const planDistributionData = [
        { name: 'Basic', value: 50, color: 'text-red-500' },
        { name: 'Premium', value: 30, color: 'text-blue-400' },
        { name: 'Deluxe', value: 20, color: 'text-purple-500' }
    ];

    // Sample data for recently subscribed members (kept as dummy data)
    const recentMembers = [
        {
            id: 1,
            name: 'Aalim aslam',
            role: 'School',
            plan: 'Basic Plan',
            avatar: '/avatar.jpeg'
        },
        {
            id: 2,
            name: 'Aalim aslam',
            role: 'Student',
            plan: 'Premium Plan',
            avatar: '/avatar.jpeg'
        },
        {
            id: 3,
            name: 'Aalim aslam',
            role: 'Student',
            plan: 'Deluxe Plan',
            avatar: '/avatar.jpeg'
        }
    ];

    // Transform the recently created tests to match the Table component's expected format
    const formattedRecentTests = recentlyCreatedTests?.map(test => ({
        id: test.id,
        name: test.title,
        class: new Date(test.createdAt).toLocaleDateString()
    })) || [];

    // Handle view button click
    const handleViewTest = (item) => {
        console.log("Viewing test:", item);
        navigate(`/tests/create/${item.id}`);
    };

    // Show loading state if data is being fetched
    if (loading) {
        return (
            <OuterCard title="Dashboard" className="bg-gray-50">
                <div className="w-full h-96 flex items-center justify-center">
                    <LoadingSpinner size="default" color="#31473A" />
                </div>
            </OuterCard>
        );
    }

    // Show error state if there was an error fetching data
    if (error) {
        return (
            <OuterCard title="Dashboard" className="bg-gray-50">
                <div className="w-full h-96 flex items-center justify-center">
                    <p className="text-red-500">Error loading dashboard: {error}</p>
                </div>
            </OuterCard>
        );
    }

    return (
        <OuterCard
            title="Dashboard"
            className="bg-gray-50"
        >
            <div className="w-full space-y-6">
                {/* Stats Cards Row - Using real data from API */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailsCard count={stats?.students || 0} label="Students" height="h-32" />
                    <DetailsCard count={stats?.schools || 0} label="Schools" height="h-32" />
                    <DetailsCard count={stats?.teachers || 0} label="Teachers" height="h-32" />
                    <DetailsCard count={stats?.totalTests || 0} label="Total Tests" height="h-32" />
                </div>

                {/* Charts Row - Using dummy data */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* User Growth Chart - Takes up 2/3 of the row on large screens */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">
                        <UserGrowthChart
                            data={userGrowthData}
                            title="Number of Users"
                            height="h-72"
                        />
                    </div>

                    {/* Plan Distribution Chart - Takes up 1/3 of the row */}
                    <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
                        <PlanDistributionChart
                            data={planDistributionData}
                            title="Plan Distribution"
                            height="h-72"
                        />
                    </div>
                </div>

                {/* Bottom Section - Tables with auto height instead of fixed */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recently Created Tests - Using real data from API */}
                    <div className="bg-white rounded-lg shadow p-4 overflow-hidden">
                        <h3 className="font-medium text-lg mb-4">Recently Created Tests</h3>
                        <Table
                            data={formattedRecentTests}
                            secondColumnName="Test Name"
                            buttonText="View"
                            buttonVariant="secondary"
                            cardClassName="min-h-0"
                            onView={handleViewTest}
                        />
                    </div>

                    {/* Recently Subscribed Members - Using dummy data */}
                    <div className="bg-white rounded-lg shadow p-4 overflow-hidden">
                        <h3 className="font-medium text-lg mb-4">Recently Subscribed Members</h3>
                        <RecentlySubscribedMembers
                            members={recentMembers}
                            maxItems={3}
                            className="min-h-0"
                        />
                    </div>
                </div>
            </div>
        </OuterCard>
    );
}