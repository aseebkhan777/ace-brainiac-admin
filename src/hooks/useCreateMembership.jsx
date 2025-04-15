import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useCreateMembership = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createMembership = async (membershipData) => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();

      // Validate required fields
      const requiredFields = ['title', 'body', 'price', 'duration'];
      const missingFields = requiredFields.filter(field => !membershipData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create an object with the membership data
      const payload = {
        title: membershipData.title,
        body: membershipData.body,
        price: Number(membershipData.price), // Ensure price is a number
        duration: Number(membershipData.duration), // Ensure duration is a number
      };

      // Debugging: Log payload contents before sending
      console.log("Membership Data payload:", payload);

      // Send POST request to create membership
      // Update the endpoint to match your API endpoint for memberships
      const response = await api.post("/admin/membership", payload);

      console.log("Membership created successfully:", response.data);
      return { success: true, data: response.data };

    } catch (err) {
      console.error("Create membership error:", err);

      // Log full response if available
      if (err.response) {
        console.error("Full Response Data:", err.response);
        console.error("Response Headers:", err.response.headers);
        console.error("Response Status:", err.response.status);
        console.error("Response Body:", err.response.data);
      } else if (err.request) {
        console.error("No response received. Request details:", err.request);
      } else {
        console.error("Error setting up the request:", err.message);
      }

      let errorMessage = err.response?.data?.message || err.message || "An unknown error occurred";
      setError(errorMessage);
      return { success: false, error: errorMessage };

    } finally {
      setLoading(false);
    }
  };

  return { createMembership, loading, error };
};

export default useCreateMembership;