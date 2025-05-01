import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OuterCard from "../../components/OuterCard";

import useCreateWorksheet from "../../hooks/useCreateWorksheet";
import DynamicForm from "../../components/DynamicForm";

// Predefined options for subject and class dropdowns
const SUBJECT_OPTIONS = [
    { value: 'Mathematics', label: 'Mathematics' },
    { value: 'Science', label: 'Science' },
    { value: 'English', label: 'English' },
    { value: 'History', label: 'History' },
    { value: 'Art', label: 'Art' }
];

export default function CreateWorksheet() {
    // Use the custom hook
    const { createWorksheet, loading, error } = useCreateWorksheet();

    // Define form fields matching the original component
    const WORKSHEET_FIELDS = [
        {
            name: 'title',
            type: 'text',
            placeholder: 'Title...',
            required: true
        },
        {
            name: 'subject',
            type: 'dropdown',
            placeholder: 'Select Subject',
            required: true,
            options: SUBJECT_OPTIONS
        },
        {
            name: 'class',
            type: 'classDropdown', 
            placeholder: 'Select Class',
            required: true,
        },
        {
            name: 'file',
            type: 'file',
            placeholder: 'Upload Worksheet (.pdf)',
            required: true,
            accept: '.pdf'
        },
        {
            name: 'publish',
            type: 'checkbox',
            label: 'Publish'
        }
    ];

    const handleSubmit = async (formData) => {
        // Validate form before submission
        if (!formData.title || !formData.subject || !formData.class || !formData.file) {
            toast.error("Please fill all required fields and upload a worksheet file");
            return;
        }

        // Call the createWorksheet function from our hook
        const result = await createWorksheet(formData);
        
        if (result.success) {
            // Show success toast notification and navigate after a slight delay
            toast.success("Worksheet created successfully!", {
                onClose: () => {
                    // Navigate after toast closes or after minimum display time
                    result.navigateTo();
                },
                autoClose: 2000 // Ensure toast shows for at least 2 seconds
            });
        } else if (result.error) {
            // Show error toast
            toast.error(result.error);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* ToastContainer for notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen p-4">
                {/* Outer Section */}
                <OuterCard title="Worksheet">
                    {/* Dynamic Form */}
                    <DynamicForm 
                        title="Create worksheet"
                        fields={WORKSHEET_FIELDS}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        submitButtonText="Create"
                    />
                </OuterCard>
            </div>
        </div>
    );
}