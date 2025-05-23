import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { AlertCircle } from "lucide-react";
import OuterCard from "../../components/OuterCard";
import { Dropdown } from "../../components/Dropdown";
import Button from "../../components/Button";
import useCreateMembership from "../../hooks/useCreateMembership";

export default function CreateMembership() {
    const [formData, setFormData] = useState({
        title: "",
        body: "",
        membershipType: "student",
        price: "",
        duration: "",
        studentsLimit: "",
        teachersLimit: "",
        testsLimit: "",
        worksheetsLimit: ""
    });
    const { createMembership, loading, error } = useCreateMembership();

    const handleInputChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const type = formData.membershipType;
            
            const baseRequiredFields = ['title', 'body', 'price', 'duration', 'membershipType'];
            const schoolRequiredFields = type === 'school' 
                ? ['studentsLimit', 'testsLimit', 'worksheetsLimit', 'teachersLimit'] 
                : [];
            
            const requiredFields = [...baseRequiredFields, ...schoolRequiredFields];
            const missingFields = requiredFields.filter(field => !formData[field]);

            if (missingFields.length > 0) {
                toast.error(`Please fill all required fields: ${missingFields.join(', ')}`);
                return;
            }

            const result = await createMembership(formData);
            
            if (result.success) {
                
                toast.success("Membership created successfully!");
                
                setTimeout(() => {
                    result.navigateTo();
                }, 2000);
            } else if (result.error) {
                toast.error(result.error);
            }
        } catch (err) {
            toast.error("Failed to create membership: " + (err.message || "Unknown error"));
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* ToastContainer  */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
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
                    <div className="w-full bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Add New Membership Plan</h2>

                        {/* Error message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                                <AlertCircle size={18} className="mr-2" />
                                {error}
                            </div>
                        )}

                        {/* Basic Information Section */}
                        <h3 className="text-md font-medium mt-6 mb-3">Basic Information</h3>
                        
                        {/* Title */}
                        <input
                            type="text"
                            placeholder="Membership Title"
                            value={formData.title}
                            className="w-full mb-3 p-2 border rounded-lg bg-white"
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            disabled={loading}
                        />
                        
                        {/* Description */}
                        <textarea
                            placeholder="Membership Description"
                            value={formData.body}
                            className="w-full mb-3 p-2 border rounded-lg bg-white"
                            onChange={(e) => handleInputChange('body', e.target.value)}
                            rows={4}
                            disabled={loading}
                        />
                        
                        {/* Membership Type */}
                        <div className="mb-3">
                            <Dropdown
                                placeholder="Select Membership Type"
                                options={[
                                    { value: 'student', label: 'Student' },
                                    { value: 'school', label: 'School' }
                                ]}
                                value={formData.membershipType}
                                onChange={(value) => handleInputChange('membershipType', value)}
                                className="w-full"
                                disabled={loading}
                            />
                        </div>
                        
                        {/* Price */}
                        <input
                            type="number"
                            placeholder="Price"
                            value={formData.price}
                            className="w-full mb-3 p-2 border rounded-lg bg-white"
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            disabled={loading}
                        />
                        
                        {/* Duration */}
                        <input
                            type="number"
                            placeholder="Duration (in days)"
                            value={formData.duration}
                            className="w-full mb-3 p-2 border rounded-lg bg-white"
                            onChange={(e) => handleInputChange('duration', e.target.value)}
                            disabled={loading}
                        />
                        
                        {/* School Plan Limits (conditionally rendered) */}
                        {formData.membershipType === 'school' && (
                            <>
                                <h3 className="text-md font-medium mt-6 mb-3">School Plan Limits</h3>
                                
                                {/* Students Limit */}
                                <input
                                    type="number"
                                    placeholder="Students Limit"
                                    value={formData.studentsLimit}
                                    className="w-full mb-3 p-2 border rounded-lg bg-white"
                                    onChange={(e) => handleInputChange('studentsLimit', e.target.value)}
                                    disabled={loading}
                                />
                                
                                {/* Teachers Limit */}
                                <input
                                    type="number"
                                    placeholder="Teachers Limit"
                                    value={formData.teachersLimit}
                                    className="w-full mb-3 p-2 border rounded-lg bg-white"
                                    onChange={(e) => handleInputChange('teachersLimit', e.target.value)}
                                    disabled={loading}
                                />
                                
                                {/* Tests Limit */}
                                <input
                                    type="number"
                                    placeholder="Tests Limit"
                                    value={formData.testsLimit}
                                    className="w-full mb-3 p-2 border rounded-lg bg-white"
                                    onChange={(e) => handleInputChange('testsLimit', e.target.value)}
                                    disabled={loading}
                                />
                                
                                {/* Worksheets Limit */}
                                <input
                                    type="number"
                                    placeholder="Worksheets Limit"
                                    value={formData.worksheetsLimit}
                                    className="w-full mb-3 p-2 border rounded-lg bg-white"
                                    onChange={(e) => handleInputChange('worksheetsLimit', e.target.value)}
                                    disabled={loading}
                                />
                            </>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            <Button
                                onClick={handleSubmit}
                                className={`bg-primary text-white px-6 py-2 rounded-lg ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Membership"}
                            </Button>
                        </div>
                    </div>
                </OuterCard>
            </div>
        </div>
    );
}