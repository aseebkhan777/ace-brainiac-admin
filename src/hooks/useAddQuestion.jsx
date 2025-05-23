import { useState } from "react";
import { apiWithAuth } from "../axios/Instance";

const useAddQuestion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  const isValidUUID = (id) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  const addBulkQuestions = async (testId, questionsData) => {
   
    if (!testId) {
      const errorMsg = "Error: testId is undefined or null";
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    
    if (!isValidUUID(testId)) {
      const errorMsg = `Invalid test ID format: ${testId}. Expected UUID format.`;
      console.error(errorMsg);
      setError(errorMsg);
      return false;
    }

    console.log("Using testId:", testId);
    console.log("Bulk Questions Data Sent to API:", questionsData);

    setLoading(true);
    setError(null);

    try {
      const api = apiWithAuth();
      const formData = new FormData();
      
      
      const processedQuestions = questionsData.questions.map((question, index) => {
        const questionCopy = { ...question };
        
        
        if (question.id && !isValidUUID(question.id) && !isNaN(question.id)) {
          delete questionCopy.id;
        }
        
        
        if (question.file && question.file instanceof File) {
         
          formData.append(`questions[${index}][file]`, question.file); 
          
          
          if (question.attachment && question.attachment.name && !question.attachment.file) {
            questionCopy.existingImageUrl = question.attachment.name;
          }
          
          
          delete questionCopy.file;
        } else if (question.attachment && question.attachment.name && !question.attachment.file) {
          
          questionCopy.existingImageUrl = question.attachment.name;
        }
        
        
        delete questionCopy.attachment;
        delete questionCopy.uploading;
        delete questionCopy.isExisting;
        
       
        if (questionCopy.question) {
          questionCopy.text = questionCopy.question;
          delete questionCopy.question;
        }
        
       
        if (questionCopy.options) {
          questionCopy.options = questionCopy.options.map(opt => {
            
            const is_correct = typeof opt.correct === 'boolean' ? opt.correct : false;
            
            return {
              text: opt.text,
              is_correct: is_correct
            };
          });
          
          
          const hasCorrectOption = questionCopy.options.some(opt => opt.is_correct === true);
          if (!hasCorrectOption && questionCopy.options.length > 0) {
            console.warn("No correct option found, forcing first option to be correct");
            questionCopy.options[0].is_correct = true;
          }
        }
        
        return questionCopy;
      });

      
      formData.append("questions", JSON.stringify(processedQuestions));
      
      
      console.log("Final processed questions:", JSON.stringify(processedQuestions, null, 2));
      
     
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };

      const response = await api.put(`/admin/test/${testId}/bulk-questions`, formData, config);

      console.log("API Response:", response.data);
      
      
      if (response.data && response.data.data) {
        const allOptionsCorrect = response.data.data.every(question => 
          question.options && question.options.some(opt => opt.is_correct === true)
        );
        
        if (!allOptionsCorrect) {
          console.warn("Warning: Backend returned questions with no correct options");
        }
      }
      
      return response.status >= 200 && response.status < 300;
    } catch (err) {
      console.error("Add bulk questions error:", err);
      
      
      let errorMessage = "Failed to add questions";
      
      if (err.response?.data?.error === "invalid input syntax for type uuid") {
        errorMessage = "Invalid ID format. Please refresh and try again.";
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Array.isArray(errors) 
          ? errors.map(e => e.msg || e.message || JSON.stringify(e)).join("; ")
          : JSON.stringify(errors);
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }

      console.error("Formatted error message:", errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { addBulkQuestions, loading, error };
};

export default useAddQuestion;