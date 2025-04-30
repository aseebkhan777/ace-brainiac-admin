import React from "react";
import DynamicForm from "../../components/common/DynamicForm";
import { toast } from "react-toastify";
import Modal from "../common/Modal";
import { useCreateSupportTicket } from "../../hooks/school/SupportTickets";

const CreateTicketModal = ({ isOpen, onClose, onSuccess }) => {
  const { createTicket, loading, error, fieldErrors } = useCreateSupportTicket();
  
  const fields = [
    {
      name: "subject",
      label: "Subject",
      placeholder: "Enter subject of your ticket",
      type: "text",
      required: true,
      hint: "Keep it concise and descriptive"
    },
    {
      name: "concern",
      label: "Concern",
      placeholder: "Please describe your concern in detail",
      type: "textarea",
      required: true,
      hint: "Provide a clear description with relevant details to help us understand your issue",
      validate: (value) => {
        if (value && value.length < 10) {
          return "Please provide more details about your concern (at least 10 characters)";
        }
        return null;
      }
    }
  ];

  const handleSubmit = async (formData) => {
    try {
      const result = await createTicket(formData);
      if (result) {
        toast.success("Support ticket created successfully!");
        onSuccess && onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error("Failed to create support ticket");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Support Ticket">
      <DynamicForm
        title=""
        fields={fields}
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        fieldErrors={fieldErrors}
        submitButtonText="Submit Ticket"
        cancelButtonText="Cancel"
        onCancel={onClose}
      />
    </Modal>
  );
};

export default CreateTicketModal;