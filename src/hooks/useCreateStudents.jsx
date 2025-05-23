import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../axios/Instance";

const useCreateStudent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createStudent = async (studentData) => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();

      // Validate required fields
      const requiredFields = ['name', 'email', 'dob', 'gender', 'class', 'phone', 'address','password'];
      const missingFields = requiredFields.filter(field => !studentData[field]);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create an object with the student data
      const payload = {
        name: studentData.name,
        email: studentData.email,
        dob: studentData.dob,
        gender: studentData.gender,
        class: studentData.class,
        phone: studentData.phone,
        address: studentData.address,
        password: studentData.password,
      };

      // Debugging: Log payload contents before sending
      console.log("Student Data payload:", payload);

      // Send POST request to create student
      const response = await api.post("/admin/student", payload);

      console.log("Student created successfully:", response.data);
      
      // Return success with navigation function
      return { 
        success: true, 
        data: response.data,
        navigateTo: () => navigate("/students") // Return navigation function to be called after toast
      };

    } catch (err) {
      console.error("Create student error:", err);

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

  return { createStudent, loading, error };
};

export default useCreateStudent;