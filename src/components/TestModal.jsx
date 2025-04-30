import React from "react";
import { X } from "lucide-react";
import DynamicForm from "./DynamicForm";


const CreateTestModal = ({ 
    isOpen, 
    onClose, 
    onSubmit, 
    loading, 
    error 
}) => {
    if (!isOpen) return null;

    // Form fields for the create test modal
    const testFormFields = [
        {
            name: "title",
            type: "text",
            label: "Title",
            placeholder: "Enter test title",
            required: true
        },
        {
            name: "subject",
            type: "dropdown",
            label: "Subject",
            placeholder: "Select subject",
            options: [
                { value: "Mathematics", label: "Mathematics" },
                { value: "Science", label: "Science" },
                { value: "English", label: "English" },
                { value: "History", label: "History" },
                { value: "Geography", label: "Geography" },
                { value: "Computer Science", label: "Computer Science" }
            ],
            required: true
        },
        {
            name: 'class',
            type: 'classDropdown',
            placeholder: 'Select Class',
            required: true,
        },
        {
            name: "totalMarks",
            type: "text",
            label: "Total Marks",
            placeholder: "Enter total marks",
            required: true
        },
        {
            name: "certificationAvailable",
            type: "checkbox",
            label: "Certification Available",
            defaultValue: false
        }
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative">
                {/* Close button */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                
                <DynamicForm
                    title="Create New Test"
                    fields={testFormFields}
                    onSubmit={onSubmit}
                    loading={loading}
                    error={error}
                    submitButtonText="Create & Continue"
                    cancelButtonText="Cancel"
                    onCancel={onClose}
                />
            </div>
        </div>
    );
};

export default CreateTestModal;