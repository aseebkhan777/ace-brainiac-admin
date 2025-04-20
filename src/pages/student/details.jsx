import React from "react";
import OuterCard from "../../components/OuterCard";
import Details from "../../components/Details";
import useFetchStudentDetails from "../../hooks/useFetchStudentDetails";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/Loader";

export default function StudentDetails() {
    const navigate = useNavigate();

    const {
        studentDetails,
        certificates,
        tests,
        loading,
        error,
        handleSuspend,
        handleActivate,
        handleBlacklist,
        handleEdit
    } = useFetchStudentDetails();

    if (loading) {
        return <div className="mt-72"><LoadingSpinner size="default" color="#31473A" /></div>;
    }

    if (error) {
        return <div className="bg-gray-50 min-h-screen flex items-center justify-center text-red-500">{error}</div>;
    }

    // Transform certificates data
    const formattedCertificates = certificates.map(certificate => ({
        id: certificate.id,
        name: certificate.title || certificate.name || "Unnamed Certificate",
        class: certificate.class || certificate.category || "N/A"
    }));

    // Transform tests data
    const formattedTests = tests.map(test => ({
        id: test.id,
        name: test.title || test.name || "Unnamed Test",
        class: test.class || "N/A",
        score: test.score || "N/A"
    }));

    // Handle view functions
    const handleViewCertificate = (item) => {
        navigate(`/certificates/${item.id}`);
    };

    const handleViewTest = (item) => {
        navigate(`/tests/${item.id}`);
    };

    // Determine button configuration based on status
    const getButtonConfig = () => {
        const status = studentDetails.status || "Active";

        if (status === "Suspended" || status === "Blacklisted") {
            return {
                mainButton: {
                    text: "Activate",
                    className: "bg-green-300 text-green-600 hover:bg-green-500 hover:text-white",
                    onClick: handleActivate
                },
                secondaryButton: null, // No secondary button for suspended/blacklisted students
                tertiaryButton: {
                    text: "Edit",
                    className: "bg-[#c8f3ff] text-black border border-[#64cffe] hover:bg-blue-500 hover:text-white",
                    onClick: handleEdit
                }
            };
        }

        // Default to Active status configuration
        return {
            mainButton: {
                text: "Suspend",
                className: "bg-red-200 text-red-500 hover:bg-red-500 hover:text-white",
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

    // Force the buttonConfig to update when studentDetails changes
    const buttonConfig = getButtonConfig();

    return (
        <div className="bg-gray-50 min-h-screen">
            <OuterCard
                title="Student"
                buttonText={buttonConfig.mainButton.text}
                buttonClassName={buttonConfig.mainButton.className}
                onButtonClick={buttonConfig.mainButton.onClick}
                secondaryButtonText={buttonConfig.secondaryButton?.text}
                secondaryButtonClassName={buttonConfig.secondaryButton?.className}
                onSecondaryButtonClick={buttonConfig.secondaryButton?.onClick}
                tertiaryButtonText={buttonConfig.tertiaryButton.text}
                tertiaryButtonClassName={buttonConfig.tertiaryButton.className}
                onTertiaryButtonClick={buttonConfig.tertiaryButton.onClick}
            >
                <div className="bg-white rounded-lg p-6 w-full">
                    <Details
                        isStudentDetails={false} // Using school-like display
                        studentName={studentDetails.fullName}
                        studentAddress={studentDetails.address || "N/A"} // Added address
                        studentClass={studentDetails.class || "N/A"} // Added class
                        membershipType={studentDetails.membershipType || "Unknown"}
                        expiryDate={studentDetails.expiryDate || "N/A"}
                        counts={{
                            tests: studentDetails.counts?.tests || 0,
                            certificates: studentDetails.counts?.certificates || 0
                        }}
                        mainTableTitle="Certificates Earned"
                        mainTableData={formattedCertificates}
                        showBottomTables={false}
                        singleBottomTableTitle="Tests Taken"
                        singleBottomTableData={formattedTests}
                        onViewMainTable={handleViewCertificate}
                        onViewSingleBottomTable={handleViewTest}
                    />
                </div>
            </OuterCard>
        </div>
    );
}