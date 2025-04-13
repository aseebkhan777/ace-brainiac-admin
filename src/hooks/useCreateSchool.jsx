import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useCreateSchool = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createSchool = async (schoolData) => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();

      // Create an object with exactly the school data fields from the JSON schema
      const payload = {
        city: schoolData.city,
        state: schoolData.state,
        principalName: schoolData.principalName,
        principalPhone: schoolData.principalPhone,
        principalEmail: schoolData.principalEmail,
        enrollmentStrength: parseInt(schoolData.enrollmentStrength) || 0,
        name: schoolData.name,
        email: schoolData.email,
        phone: schoolData.phone,
        password: schoolData.password,
        schoolName: schoolData.schoolName
      };

      // Debugging: Log payload contents before sending
      console.log("School Data payload:", payload);

      // Send POST request to create school
      const response = await api.post("/admin/schools", payload);

      console.log("School created successfully:", response.data);
      return { success: true, data: response.data };

    } catch (err) {
      console.error("Create school error:", err);

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

  return { createSchool, loading, error };
};

export default useCreateSchool;