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

const CLASS_OPTIONS = [
    { value: '1st Grade', label: 'Grade 1' },
    { value: '2nd Grade', label: 'Grade 2' },
    { value: '3rd Grade', label: 'Grade 3' },
    { value: '4th Grade', label: 'Grade 4' },
    { value: '5th Grade', label: 'Grade 5' },
    { value: '6th Grade', label: 'Grade 6' },
    { value: '7th Grade', label: 'Grade 7' },
    { value: '8th Grade', label: 'Grade 8' },
    { value: '9th Grade', label: 'Grade 9' },
    { value: '10th Grade', label: 'Grade 10' },
    { value: '11th Grade', label: 'Grade 11' },
    { value: '12th Grade', label: 'Grade 12' }
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
            type: 'dropdown',
            placeholder: 'Select Class',
            required: true,
            options: CLASS_OPTIONS
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
            // Show success toast notification
            toast.success("Student created successfully!");
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