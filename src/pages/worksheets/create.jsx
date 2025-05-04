import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OuterCard from "../../components/OuterCard";

import useCreateWorksheet from "../../hooks/useCreateWorksheet";
import DynamicForm from "../../components/DynamicForm";



export default function CreateWorksheet() {
    
    const { createWorksheet, loading, error } = useCreateWorksheet();

    
    const WORKSHEET_FIELDS = [
        {
            name: 'title',
            type: 'text',
            placeholder: 'Title...',
            required: true
        },
        {
            name: 'subject',
            type: 'subjectDropdown',
            placeholder: 'Select Subject',
            required: true,
            
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

       
        const result = await createWorksheet(formData);
        
        if (result.success) {
            
            toast.success("Worksheet created successfully!", {
                onClose: () => {
                    
                    result.navigateTo();
                },
                autoClose: 2000 
            });
        } else if (result.error) {
            
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