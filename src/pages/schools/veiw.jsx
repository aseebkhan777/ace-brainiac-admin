import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import useFetchSchool from "../../hooks/useFetchSchool";
import { MapPin, School, User, Phone, Mail, Users } from "lucide-react";

const SchoolDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const { school, setSchool, loading, error, updateSchool } = useFetchSchool(id);
    const [originalSchool, setOriginalSchool] = useState(null);

    // Store original school data when entering edit mode
    const handleStartEditing = () => {
        setOriginalSchool({...school});
        setIsEditing(true);
    };

    const handleCancel = () => {
        setSchool(originalSchool);
        setIsEditing(false);
    };

    const handleInputChange = (field) => (e) => {
        setSchool({
            ...school,
            [field]: e.target.value
        });
    };

    const handleSave = async () => {
        const result = await updateSchool(school);
        if (result.success) {
            setOriginalSchool(null);
            setIsEditing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString();
    };

    // Function to get status pill color
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE':
                return 'bg-green-500';
            case 'SUSPENDED':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Display data - use original data when in edit mode
    const displayData = isEditing && originalSchool ? originalSchool : school;

    if (error) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="flex-1 px-6 md:px-28 py-10 bg-white">
                    <div className="pt-14 text-red-600">
                        <h2 className="text-xl font-semibold">Error Loading School</h2>
                        <p className="mt-2">{error}</p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 border px-4 py-2 rounded-lg border-[#31473a] text-gray-700 hover:bg-[#EEF4F2]"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Main Content */}
            <div className="flex-1 px-6 md:px-28 py-10 bg-white">
                <div className="flex justify-between items-center pt-14">
                    <h1 className="text-xl md:text-2xl font-semibold">School Details</h1>
                    <button
                        onClick={() => navigate(-1)}
                        className="border px-4 py-2 rounded-lg border-[#31473a] text-gray-700 hover:bg-[#EEF4F2]"
                    >
                        Back
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading school data...</p>
                    </div>
                ) : (
                    <div className="shadow-md rounded-xl mt-6 flex flex-col lg:flex-row items-center lg:items-stretch justify-center py-8 px-8 lg:px-14 bg-[#EEF4F2]">
                        {/* School Header */}
                        <div className="w-full lg:w-1/3 flex flex-col items-center pt-7 lg:pt-7 pr-0 lg:pr-6">
                            <div className="w-24 h-24 md:w-44 md:h-44 rounded-full bg-white flex items-center justify-center">
                                <School size={64} className="text-[#31473a]" />
                            </div>
                            <div className="mt-4 text-center">
                                <p className="text-lg font-semibold">{displayData.schoolName}</p>
                                <p className="text-gray-600 flex items-center justify-center">
                                    <MapPin size={16} className="mr-1" />
                                    {displayData.city}, {displayData.state}
                                </p>
                                <div className="mt-2 flex justify-center">
                                    <span className={`${getStatusColor(displayData.status)} text-white text-sm px-3 py-1 rounded-full`}>
                                        {displayData.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* School Details */}
                        <div className="w-full lg:w-2/3 bg-white p-6 md:p-10 rounded-xl shadow-sm mt-4 lg:mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">School Name</label>
                                    <Input value={school.schoolName} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">School ID</label>
                                    <Input value={school.id} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">City</label>
                                    {isEditing ? (
                                        <Input
                                            value={school.city}
                                            onChange={handleInputChange("city")}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={school.city} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">State</label>
                                    {isEditing ? (
                                        <Input
                                            value={school.state}
                                            onChange={handleInputChange("state")}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={school.state} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">
                                        <div className="flex items-center">
                                            <Users size={16} className="mr-1" />
                                            Enrollment Strength
                                        </div>
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            value={school.enrollmentStrength}
                                            onChange={handleInputChange("enrollmentStrength")}
                                            className="w-full"
                                            type="number"
                                        />
                                    ) : (
                                        <Input value={school.enrollmentStrength} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Status</label>
                                    <Input value={school.status} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>
                            </div>

                            {/* Principal Information Section */}
                            <div className="mt-6">
                                <h3 className="text-md font-semibold mb-3">Principal Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-600 text-sm font-semibold mb-1">
                                            <div className="flex items-center">
                                                <User size={16} className="mr-1" />
                                                Principal Name
                                            </div>
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={school.principalName}
                                                onChange={handleInputChange("principalName")}
                                                className="w-full"
                                            />
                                        ) : (
                                            <Input value={school.principalName} readOnly className="w-full bg-[#EEF4F2]" />
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-600 text-sm font-semibold mb-1">
                                            <div className="flex items-center">
                                                <Phone size={16} className="mr-1" />
                                                Principal Phone
                                            </div>
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={school.principalPhone}
                                                onChange={handleInputChange("principalPhone")}
                                                className="w-full"
                                            />
                                        ) : (
                                            <Input value={school.principalPhone} readOnly className="w-full bg-[#EEF4F2]" />
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-600 text-sm font-semibold mb-1">
                                            <div className="flex items-center">
                                                <Mail size={16} className="mr-1" />
                                                Principal Email
                                            </div>
                                        </label>
                                        {isEditing ? (
                                            <Input
                                                value={school.principalEmail}
                                                onChange={handleInputChange("principalEmail")}
                                                className="w-full"
                                                type="email"
                                            />
                                        ) : (
                                            <Input value={school.principalEmail} readOnly className="w-full bg-[#EEF4F2]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Created At</label>
                                    <Input value={formatDate(school.createdAt)} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Updated At</label>
                                    <Input value={formatDate(school.updatedAt)} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row justify-end gap-4 mt-6">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancel}
                                            className="border px-4 py-2 rounded-lg border-[#31473a] text-gray-700 hover:bg-[#EEF4F2]"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="bg-[#31473a] text-white px-6 py-2 rounded-lg hover:bg-[#4a6a57]"
                                        >
                                            Save
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleStartEditing}
                                        className="bg-[#31473a] text-white px-6 py-2 rounded-lg hover:bg-[#4a6a57]"
                                    >
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SchoolDetails;