import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OuterCard from "../../components/OuterCard";
import DynamicForm from "../../components/DynamicForm";
import useCreateStudent from "../../hooks/useCreateStudents";

// Predefined options for gender and class dropdowns
const GENDER_OPTIONS = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
];

export default function CreateStudent() {
    // Use the custom hook for creating a student
    const { createStudent, loading, error } = useCreateStudent();

    // Define form fields matching the backend requirements
    const STUDENT_FIELDS = [
        {
            name: 'name',
            type: 'text',
            placeholder: 'Full Name',
            required: true
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Email Address',
            required: true
        },
        {
            name: 'dob',
            type: 'date',
            placeholder: 'Date of Birth',
            required: true
        },
        {
            name: 'gender',
            type: 'dropdown',
            placeholder: 'Select Gender',
            required: true,
            options: GENDER_OPTIONS
        },
        {
            name: 'class',
            type: 'classDropdown', 
            placeholder: 'Select Class',
            required: true,
        },
        {
            name: 'phone',
            type: 'tel',
            placeholder: 'Phone Number',
            required: true
        },
        {
            name: 'address',
            type: 'text',
            placeholder: 'Home Address',
            required: true
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Password',
            required: true
        }
    ];

    const handleSubmit = async (formData) => {
        // Validate form before submission
        const requiredFields = ['name', 'email', 'dob', 'gender', 'class', 'phone', 'address','password'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
            return;
        }

        // Call the createStudent function from our hook
        const result = await createStudent(formData);
        
        if (result.success) {
            // Show success toast notification and navigate after toast closes
            toast.success("Student created successfully!", {
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
                <OuterCard title="Create Student">
                    {/* Dynamic Form */}
                    <DynamicForm 
                        title="Add New Student"
                        fields={STUDENT_FIELDS}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        submitButtonText="Create Student"
                    />
                </OuterCard>
            </div>
        </div>
    );
}