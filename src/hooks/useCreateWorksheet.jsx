import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiWithAuth } from "../axios/Instance";


const useCreateWorksheet = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createWorksheet = async (worksheetData) => {
    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();

      // Validate that a file is present
      if (!worksheetData.file) {
        throw new Error("File is required for worksheet creation");
      }

      // Ensure the file is a valid File object
      if (!(worksheetData.file instanceof File)) {
        throw new Error("Invalid file. Please select a valid file.");
      }

      // Create FormData object for multipart/form-data
      const formData = new FormData();

      // Append file to form data - using capital "F" to match error message
      formData.append("file", worksheetData.file, worksheetData.file.name);

      // Append other required fields
      formData.append("title", worksheetData.title);
      formData.append("subject", worksheetData.subject);
      formData.append("class", worksheetData.class);

      // If publish is included, add it to formData
      if (worksheetData.publish !== undefined) {
        formData.append("publish", worksheetData.publish.toString());
      }

      // Debugging: Log FormData contents before sending
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, typeof value === 'object' ? `File: ${value.name}` : value);
      }

      // Set explicit Content-Type header to ensure proper handling
      const response = await api.post("/admin/worksheet", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log("Worksheet created successfully:", response.data);
      
      // Return success without navigating - we'll handle navigation in the component
      return { 
        success: true, 
        data: response.data,
        navigateTo: () => navigate("/worksheets") // Return navigation function to be called after toast
      };

    } catch (err) {
      console.error("Create worksheet error:", err);

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

  return { createWorksheet, loading, error };
};

export default useCreateWorksheet;