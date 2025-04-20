import { useState, useEffect } from "react";
import { apiWithAuth } from "../axios/Instance";

const useDashboardData = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      students: 0,
      schools: 0,
      teachers: 0,
      totalTests: 0
    },
    subscriptionDistribution: {},
    recentlyCreatedTests: [],
    recentlySubscribedMembers: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();
      const response = await api.get('/admin/admin/dashboard');

      if (response.data && response.data.data) {
        // Transform the API response to match our expected format
        const transformedData = {
          stats: {
            students: response.data.data.counts.students || 0,
            schools: response.data.data.counts.schools || 0,
            teachers: response.data.data.counts.teachers || 0,
            totalTests: response.data.data.counts.tests || 0
          },
          subscriptionDistribution: response.data.data.subscriptionDistribution || {},
          recentlyCreatedTests: response.data.data.recentlyCreatedTests || [],
          recentlySubscribedMembers: response.data.data.recentlySubscribedMembers || []
        };
        
        setDashboardData(transformedData);
        return transformedData;
      } else {
        setError("Invalid response structure");
        return null;
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      if (isMounted) {
        await fetchDashboardData();
      }
    };
    
    fetchData();
    
    // Cleanup function to prevent state updates if component unmounts
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array ensures this runs only once

  return { dashboardData, loading, error, refreshDashboardData: fetchDashboardData };
};

export default useDashboardData;