import React from "react";
import OuterCard from "../../components/OuterCard";
import Details from "../../components/Details";
import useFetchSchoolDetails from "../../hooks/useFetchSchoolDetails";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/Loader";

export default function SchoolDetails() {
    const navigate = useNavigate();

    const {
        schoolDetails,
        worksheets,
        tests,
        students,
        loading,
        error,
        handleSuspend,
        handleActivate,
        handleApprove,
        handleBlacklist,
        handleEdit
    } = useFetchSchoolDetails();

    if (loading) {
        return <div className="mt-60"><LoadingSpinner size="default" color="#31473A" /></div>;
    }

    if (error) {
        return <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    // Transform worksheets data to include name and class
    const formattedWorksheets = worksheets.map(worksheet => ({
        id: worksheet.id,
        name: worksheet.title,
        class: worksheet.class
    }));

    // Transform tests data
    const formattedTests = tests.map(test => ({
        id: test.id,
        name: test.title,
        class: test.class
    }));

    // Transform students data
    const formattedStudents = students.map(student => ({
        id: student.id,
        name: student.user?.name || "Unknown",
        class: student.class
    }));

    // Handle view functions
    const handleViewWorksheet = (item) => {
        navigate(`/worksheets/${item.id}`);
    };

    const handleViewTest = (item) => {
        navigate(`/tests/create/${item.id}`);
    };

    const handleViewStudent = (item) => {
        navigate(`/students/${item.id}`);
    };

    // Determine button configuration based on status
    const getButtonConfig = () => {
        const status = schoolDetails.status || "ACTIVE";

        // Handle PENDING status - only show Approve button
        if (status === "Pending") {
            return {
                mainButton: {
                    text: "Approve",
                    variant: "edit",
                    className: "bg-green-300 text-green-600 hover:bg-green-500 hover:text-white",
                    onClick: handleApprove
                },
                secondaryButton: null,
                tertiaryButton: null
            };
        }

        // Handle SUSPENDED or BLACKLISTED status
        if (status === "Suspended" || status === "Blacklisted") {
            return {
                mainButton: {
                    text: "Activate",
                    variant: "edit",
                    className: "bg-green-300 text-green-600 hover:bg-green-500 hover:text-white",
                    onClick: handleActivate
                },
                secondaryButton: null, // No secondary button for suspended/blacklisted schools
                tertiaryButton: {
                    text: "Edit",
                    variant: "edit",
                    className: "bg-[#c8f3ff] text-black border border-[#64cffe] hover:bg-blue-500 hover:text-white",
                    onClick: handleEdit
                }
            };
        }

        // Default to ACTIVE status configuration
        return {
            mainButton: {
                text: "Suspend",
                className: "bg-red-200 text-red-500 border border-red-500 hover:bg-red-500 hover:text-white",
                onClick: handleSuspend
            },
            secondaryButton: {
                text: "Blacklist",
                className: "bg-transparent text-red-500 border border-red-500 hover:bg-red-500 hover:text-white",
                onClick: handleBlacklist
            },
            tertiaryButton: {
                text: "Edit",
                className: "bg-[#c8f3ff] text-black border border-[#64cffe] hover:bg-blue-500 hover:text-white",
                onClick: handleEdit
            }
        };
    };

    // Force the buttonConfig to update when schoolDetails changes
    const buttonConfig = getButtonConfig();

    return (
        <div className="bg-gray-50 min-h-screen">
            <OuterCard
                title="School"
                buttonText={buttonConfig.mainButton.text}
                buttonClassName={buttonConfig.mainButton.className}
                onButtonClick={buttonConfig.mainButton.onClick}
                secondaryButtonText={buttonConfig.secondaryButton?.text}
                secondaryButtonClassName={buttonConfig.secondaryButton?.className}
                onSecondaryButtonClick={buttonConfig.secondaryButton?.onClick}
                tertiaryButtonText={buttonConfig.tertiaryButton?.text}
                tertiaryButtonClassName={buttonConfig.tertiaryButton?.className}
                onTertiaryButtonClick={buttonConfig.tertiaryButton?.onClick}
            >
                <div className="bg-white rounded-lg p-6 w-full">
                    <Details
                        schoolName={schoolDetails.schoolName}
                        schoolLocation={schoolDetails.location}
                        membershipType={schoolDetails.membershipType}
                        expiryDate={schoolDetails.expiryDate}
                        counts={schoolDetails.counts}
                        mainTableTitle="Worksheets"
                        mainTableData={formattedWorksheets}
                        leftTableTitle="Tests"
                        leftTableData={formattedTests}
                        rightTableTitle="Students"
                        rightTableData={formattedStudents}
                        showBottomTables={true}
                        onViewMainTable={handleViewWorksheet}
                        onViewLeftTable={handleViewTest}
                        onViewRightTable={handleViewStudent}
                    />
                </div>
            </OuterCard>
        </div>
    );
}