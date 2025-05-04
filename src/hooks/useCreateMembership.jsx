import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../axios/Instance";

const useCreateMembership = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createMembership = async (membershipData) => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();

     
      const baseRequiredFields = ['title', 'body', 'price', 'duration'];
      const schoolRequiredFields = membershipData.membershipType === 'school' 
        ? ['studentsLimit', 'teachersLimit', 'testsLimit', 'worksheetsLimit'] 
        : [];
      
      const requiredFields = [...baseRequiredFields, ...schoolRequiredFields];
      const missingFields = requiredFields.filter(field => !membershipData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      
      const payload = {
        title: membershipData.title,
        body: membershipData.body,
        price: Number(membershipData.price),
        duration: Number(membershipData.duration),
        membershipType: membershipData.membershipType
      };

      
      if (membershipData.membershipType === 'school') {
        payload.studentsLimit = Number(membershipData.studentsLimit);
        payload.teachersLimit = Number(membershipData.teachersLimit);
        payload.testsLimit = Number(membershipData.testsLimit);
        payload.worksheetsLimit = Number(membershipData.worksheetsLimit);
      }

      const response = await api.post("/admin/membership", payload);
      
      
      return { 
        success: true, 
        data: response.data,
        navigateTo: () => navigate("/memberships") 
      };

    } catch (err) {
      console.error("Create membership error:", err);

      
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