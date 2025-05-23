import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OuterCard from "../../components/OuterCard";
import DynamicForm from "../../components/DynamicForm";
import useCreateSchool from "../../hooks/useCreateSchool";

export default function CreateSchool() {
  
    const { createSchool, loading, error } = useCreateSchool();

   
    const SCHOOL_FIELDS = [
        // School Information
        {
            name: 'schoolName',
            type: 'text',
            placeholder: 'School Name',
            required: true,
            sectionTitle: 'School Information'
        },
        {
            name: 'city',
            type: 'text',
            placeholder: 'City',
            required: true
        },
        {
            name: 'state',
            type: 'text',
            placeholder: 'State',
            required: true
        },
        {
            name: 'enrollmentStrength',
            type: 'number',
            placeholder: 'Enrollment Strength (Number of Students)',
            required: true
        },
        
        // Principal Information
        {
            name: 'principalName',
            type: 'text',
            placeholder: 'Principal Name',
            required: true,
            sectionTitle: 'Principal Information'
        },
        {
            name: 'principalPhone',
            type: 'tel',
            placeholder: 'Principal Phone',
            required: true
        },
        {
            name: 'principalEmail',
            type: 'email',
            placeholder: 'Principal Email',
            required: true
        },
        
        // Admin Account Information
        {
            name: 'name',
            type: 'text',
            placeholder: 'Coordinator Name',
            required: true,
            sectionTitle: 'Coordinator Account Information'
        },
        {
            name: 'email',
            type: 'email',
            placeholder: 'Coordinator Email',
            required: true
        },
        {
            name: 'phone',
            type: 'tel',
            placeholder: 'Coordinator Phone',
            required: true
        },
        {
            name: 'password',
            type: 'password',
            placeholder: 'Coordinator Password',
            required: true
        }
    ];

    const handleSubmit = async (formData) => {
        
        const result = await createSchool(formData);
        
        if (result.success) {
            
            toast.success("School created successfully!", {
                onClose: () => {
                    
                    result.navigateTo();
                },
                autoClose: 2000 
            });
        } else if (result.error) {
            // Show error toast
            toast.error(result.error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
           
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-4">
                {/* Outer Section */}
                <OuterCard title="Create School">
                    {/* Dynamic Form */}
                    <DynamicForm 
                        title="Add New School"
                        fields={SCHOOL_FIELDS}
                        onSubmit={handleSubmit}
                        loading={loading}
                        error={error}
                        submitButtonText="Create School"
                    />
                </OuterCard>
            </div>
        </div>
    );
}