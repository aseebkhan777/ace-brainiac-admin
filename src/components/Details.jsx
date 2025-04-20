import React from 'react';
import Table from './Table';

export default function Details({
  // General information
  schoolName = "",
  schoolLocation = "",
  studentName = "",
  studentEmail = "",
  studentAddress = "", // Added address
  studentClass = "",
  joinDate = "",
  membershipType = "",
  expiryDate = "",
  
  // Counts for the stats boxes
  counts = { students: 0, worksheets: 0, tests: 0, certificates: 0 },
  
  // Table configurations
  mainTableTitle = "Worksheets",
  mainTableData = [],
  showBottomTables = true,
  leftTableTitle = "Tests",
  leftTableData = [],
  rightTableTitle = "Students",
  rightTableData = [],
  singleBottomTableTitle = "",
  singleBottomTableData = [],
  
  // Special configuration for student details
  isStudentDetails = false,
  showTestsAndCertificatesOnly = false,
  
  // Click handlers
  onViewMainTable = () => {},
  onViewLeftTable = () => {},
  onViewRightTable = () => {},
  onViewSingleBottomTable = () => {}
}) {
  // Determine which view to show (school or student)
  const isSchoolView = !isStudentDetails;
  
  return (
    <div className="w-full">
      {/* Top Section with Info and Main Table side by side */}
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        {/* Left Side - School/Student Info */}
        <div className="md:w-1/2 pt-8">
          {/* Logo and Info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-gray-200 rounded-full w-24 h-24 flex-shrink-0"></div>
            <div className="pt-2">
              {isSchoolView ? (
                <>
                  <h1 className="text-2xl font-bold">{schoolName || studentName}</h1>
                  {studentName ? (
                    <>
                      <p className="text-gray-700">{studentAddress}</p>
                      <p className="text-gray-700">Class: {studentClass}</p>
                    </>
                  ) : (
                    <p className="text-gray-700">{schoolLocation}</p>
                  )}
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{studentName}</h1>
                  <p className="text-gray-700">{studentAddress}</p>
                  <p className="text-gray-700">Class: {studentClass}</p>
                </>
              )}
            </div>
          </div>
          
          {/* Membership Info - For both School and Student view */}
          {membershipType && (
            <div className="mb-6">
              <div className="flex items-center gap-2 pt-2">
                <span className="font-medium pl-4">{membershipType} Membership</span>
                <span className="text-sm text-gray-600">Will expire at {expiryDate}</span>
              </div>
            </div>
          )}

          {/* Stats Boxes */}
          <div className="flex gap-3">
            {/* For School View - Three boxes */}
            {isSchoolView && !studentName && (
              <>
                <div className="flex-1 bg-gradient-to-br from-primary to-green-700 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{counts.students}</div>
                  <div className="text-sm">Students</div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-primary to-green-700 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{counts.worksheets}</div>
                  <div className="text-sm">Worksheets</div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-primary to-green-700 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{counts.tests}</div>
                  <div className="text-sm">Tests</div>
                </div>
              </>
            )}
            
            {/* For Student View or School view with studentName - Two boxes */}
            {(isStudentDetails || studentName) && (
              <>
                <div className="flex-1 bg-gradient-to-br from-primary to-green-700 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{counts.tests}</div>
                  <div className="text-sm">Tests Taken</div>
                </div>
                <div className="flex-1 bg-gradient-to-br from-primary to-green-700 text-white rounded-lg p-4 flex flex-col items-center justify-center">
                  <div className="text-3xl font-bold">{counts.certificates}</div>
                  <div className="text-sm">Certificates</div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Side - Main Table */}
        <div className="md:w-1/2">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">{mainTableTitle}</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">see all</a>
          </div>
          <Table 
            data={mainTableData}
            secondColumnName="Name"
            onView={onViewMainTable}
            cardClassName="bg-gray-50"
          />
        </div>
      </div>

      {/* Bottom Section - Different configurations based on view */}
      {showBottomTables && !showTestsAndCertificatesOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{leftTableTitle}</h2>
              <a href="#" className="text-sm text-blue-600 hover:underline">see all</a>
            </div>
            <Table 
              data={leftTableData}
              secondColumnName="Name"
              onView={onViewLeftTable}
              cardClassName="bg-gray-50"
            />
          </div>

          {/* Right Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{rightTableTitle}</h2>
              <a href="#" className="text-sm text-blue-600 hover:underline">see all</a>
            </div>
            <Table 
              data={rightTableData}
              secondColumnName="Name"
              onView={onViewRightTable}
              cardClassName="bg-gray-50"
            />
          </div>
        </div>
      )}

      {/* Single Bottom Table - Full Width */}
      {(!showBottomTables || showTestsAndCertificatesOnly) && (singleBottomTableTitle || leftTableTitle) && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">{singleBottomTableTitle || leftTableTitle}</h2>
            <a href="#" className="text-sm text-blue-600 hover:underline">see all</a>
          </div>
          <Table 
            data={singleBottomTableData || leftTableData}
            secondColumnName="Name"
            onView={onViewSingleBottomTable || onViewLeftTable}
            cardClassName="bg-gray-50"
          />
        </div>
      )}
    </div>
  );
}