import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Dropdown } from "../../components/Dropdown";
import Input from "../../components/Input";
import useFetchStudent from "../../hooks/useFetchStudent";

const StudentDetails = () => {
    const { id } = useParams(); // Get ID from URL params
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const { student, setStudent, loading, error, updateStudent } = useFetchStudent(id);
    const [originalStudent, setOriginalStudent] = useState(null);

    // Options for dropdowns
    const genderOptions = [
        { value: "Male", label: "Male" },
        { value: "Female", label: "Female" },
        { value: "Other", label: "Other" }
    ];

    const classOptions = [
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

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "On-hold", label: "On Hold" },
        { value: "Suspended", label: "Suspended" }
    ];

    // Store original student data when entering edit mode
    const handleStartEditing = () => {
        setOriginalStudent({...student});
        setIsEditing(true);
    };

    const handleCancel = () => {
        setStudent(originalStudent);
        setIsEditing(false);
    };

    const handleInputChange = (field) => (e) => {
        setStudent({
            ...student,
            [field]: e.target.value
        });
    };

    const handleDropdownChange = (field) => (value) => {
        setStudent({
            ...student,
            [field]: value
        });
    };

    const handleSave = async () => {
        const result = await updateStudent(student);
        if (result.success) {
            setOriginalStudent(null);
            setIsEditing(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleString();
    };

    // Function to format class display
    const formatClassDisplay = (classValue) => {
        if (!classValue) return "";
        // If classValue already contains "Class", return just the number part
        if (classValue.startsWith("Class")) {
            return classValue.replace("Class", "").trim();
        }
        return classValue;
    };

    // Function to get status pill color
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-500';
            case 'on-hold':
                return 'bg-yellow-500';
            case 'suspended':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    // Display data - use original data when in edit mode
    const displayData = isEditing && originalStudent ? originalStudent : student;

    if (error) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen">
                <div className="flex-1 px-6 md:px-28 py-10 bg-white">
                    <div className="pt-14 text-red-600">
                        <h2 className="text-xl font-semibold">Error Loading Student</h2>
                        <p className="mt-2">{error}</p>
                        <button
                            onClick={() => navigate(-1)} // Go back to previous page
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
                    <h1 className="text-xl md:text-2xl font-semibold">Student Details</h1>
                    <button
                        onClick={() => navigate(-1)} // Go back to previous page
                        className="border px-4 py-2 rounded-lg border-[#31473a] text-gray-700 hover:bg-[#EEF4F2]"
                    >
                        Back
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p>Loading student data...</p>
                    </div>
                ) : (
                    <div className="shadow-md rounded-xl mt-6 flex flex-col lg:flex-row items-center lg:items-stretch justify-center py-8 px-8 lg:px-14 bg-[#EEF4F2]">
                        {/* Profile Image - Using displayData instead of student */}
                        <div className="w-full lg:w-1/3 flex flex-col items-center pt-7 lg:pt-7 pr-0 lg:pr-6">
                            <img
                                src={displayData.gender === "Female" ? "/avatar.jpeg" : "/avatar.jpeg"}
                                alt="Student Profile"
                                className="w-24 h-24 md:w-44 md:h-44 rounded-full"
                            />
                            <div className="mt-4 text-center">
                                <p className="text-lg font-semibold">{displayData.name}</p>
                                {/* Fixed class display - using displayData */}
                                <p className="text-gray-600">Class {formatClassDisplay(displayData.class)}</p>
                                {/* Status pill - using displayData */}
                                <div className="mt-2 flex justify-center">
                                    <span className={`${getStatusColor(displayData.status)} text-white text-sm px-3 py-1 rounded-full`}>
                                        {displayData.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Student Details */}
                        <div className="w-full lg:w-2/3 bg-white p-6 md:p-10 rounded-xl shadow-sm mt-4 lg:mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Name</label>
                                    {isEditing ? (
                                        <Input
                                            value={student.name}
                                            onChange={handleInputChange("name")}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={student.name} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Email</label>
                                    {isEditing ? (
                                        <Input
                                            value={student.email}
                                            onChange={handleInputChange("email")}
                                            className="w-full"
                                            type="email"
                                        />
                                    ) : (
                                        <Input value={student.email} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Phone</label>
                                    {isEditing ? (
                                        <Input
                                            value={student.phone}
                                            onChange={handleInputChange("phone")}
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={student.phone} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Date of Birth</label>
                                    {isEditing ? (
                                        <Input
                                            value={student.dob}
                                            onChange={handleInputChange("dob")}
                                            className="w-full"
                                            type="date"
                                        />
                                    ) : (
                                        <Input value={student.formattedDob || student.dob} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Gender</label>
                                    {isEditing ? (
                                        <Dropdown
                                            value={student.gender}
                                            onChange={handleDropdownChange("gender")}
                                            options={genderOptions}
                                            placeholder="Select Gender"
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={student.gender} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Class</label>
                                    {isEditing ? (
                                        <Dropdown
                                            value={student.class}
                                            onChange={handleDropdownChange("class")}
                                            options={classOptions}
                                            placeholder="Select Class"
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={student.class} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Status</label>
                                    {isEditing ? (
                                        <Dropdown
                                            value={student.status}
                                            onChange={handleDropdownChange("status")}
                                            options={statusOptions}
                                            placeholder="Select Status"
                                            className="w-full"
                                        />
                                    ) : (
                                        <Input value={student.status} readOnly className="w-full bg-[#EEF4F2]" />
                                    )}
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="block text-gray-600 text-sm font-semibold mb-1">Address</label>
                                {isEditing ? (
                                    <Input
                                        value={student.address}
                                        onChange={handleInputChange("address")}
                                        className="w-full"
                                    />
                                ) : (
                                    <Input value={student.address} readOnly className="w-full bg-[#EEF4F2]" />
                                )}
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Created At</label>
                                    <Input value={formatDate(student.createdAt)} readOnly className="w-full bg-[#EEF4F2]" />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-gray-600 text-sm font-semibold mb-1">Updated At</label>
                                    <Input value={formatDate(student.updatedAt)} readOnly className="w-full bg-[#EEF4F2]" />
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

export default StudentDetails;