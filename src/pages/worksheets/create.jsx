import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";;
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

const CLASS_OPTIONS = [
    { value: '1', label: 'Grade 1' },
    { value: '2', label: 'Grade 2' },
    { value: '3', label: 'Grade 3' },
    { value: '4', label: 'Grade 4' },
    { value: '5', label: 'Grade 5' },
    { value: '6', label: 'Grade 6' },
    { value: '7', label: 'Grade 7' },
    { value: '8', label: 'Grade 8' },
    { value: '9', label: 'Grade 9' },
    { value: '10', label: 'Grade 10' },
    { value: '11', label: 'Grade 11' },
    { value: '12', label: 'Grade 12' }
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
            type: 'dropdown',
            placeholder: 'Select Class',
            required: true,
            options: CLASS_OPTIONS
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
            // Show success toast notification
            toast.success("Worksheet created successfully!");
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