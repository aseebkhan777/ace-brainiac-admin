import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OuterCard from "../../components/OuterCard";
import DynamicForm from "../../components/DynamicForm";
import useCreateMembership from "../../hooks/useCreateMembership";

export default function CreateMembership() {
    // Use the custom hook for creating a membership
    const { createMembership, loading, error } = useCreateMembership();

    // Define form fields matching the backend requirements
    const MEMBERSHIP_FIELDS = [
        {
            name: 'title',
            type: 'text',
            placeholder: 'Membership Title',
            required: true
        },
        {
            name: 'body',
            type: 'textarea',
            placeholder: 'Membership Description',
            required: true
        },
        {
            name: 'price',
            type: 'number',
            placeholder: 'Price',
            required: true
        },
        {
            name: 'duration',
            type: 'number',
            placeholder: 'Duration (in days)',
            required: true
        }
    ];

    const handleSubmit = async (formData) => {
        // Validate form before submission
        const requiredFields = ['title', 'body', 'price', 'duration'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Call the createMembership function from our hook
        const result = await createMembership(formData);
        
        if (result.success) {
            // Show success toast notification and navigate after toast closes
            toast.success("Membership created successfully!", {
                onClose: () => {
                    // Navigate after toast closes
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
                <OuterCard title="Create Membership">
                    {/* Dynamic Form */}
                    <DynamicForm 
                        title="Add New Membership Plan"
                        fields={MEMBERSHIP_FIELDS}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        submitButtonText="Create Membership"
                    />
                </OuterCard>
            </div>
        </div>
    );
}