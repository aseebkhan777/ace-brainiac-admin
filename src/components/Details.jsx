import React, { useState } from 'react';
import Table from './Table';

export default function Details({
  // General information
  schoolName = "",
  schoolLocation = "",
  studentName = "",
  studentEmail = "",
  studentAddress = "", 
  studentClass = "",
  joinDate = "",
  membershipType = "",
  expiryDate = "",
  
  
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
  
  
  isStudentDetails = false,
  showTestsAndCertificatesOnly = false,
  

  onViewMainTable = () => {},
  onViewLeftTable = () => {},
  onViewRightTable = () => {},
  onViewSingleBottomTable = () => {}
}) {

  const [showAllMain, setShowAllMain] = useState(false);
  const [showAllLeft, setShowAllLeft] = useState(false);
  const [showAllRight, setShowAllRight] = useState(false);
  const [showAllSingle, setShowAllSingle] = useState(false);
  
  
  const isSchoolView = !isStudentDetails;
  

  const hasMembership = membershipType && membershipType !== "Unknown" && expiryDate && expiryDate !== "Invalid Date";
  

  const handleSeeAllMain = (e) => {
    e.preventDefault();
    setShowAllMain(!showAllMain);
  };
  
  const handleSeeAllLeft = (e) => {
    e.preventDefault();
    setShowAllLeft(!showAllLeft);
  };
  
  const handleSeeAllRight = (e) => {
    e.preventDefault();
    setShowAllRight(!showAllRight);
  };
  
  const handleSeeAllSingle = (e) => {
    e.preventDefault();
    setShowAllSingle(!showAllSingle);
  };
  
 
  const displayMainData = showAllMain ? mainTableData : mainTableData.slice(0, 5);
  const displayLeftData = showAllLeft ? leftTableData : leftTableData.slice(0, 5);
  const displayRightData = showAllRight ? rightTableData : rightTableData.slice(0, 5);
  const displaySingleData = showAllSingle 
    ? (singleBottomTableData || leftTableData) 
    : (singleBottomTableData || leftTableData).slice(0, 5);
  

  const scrollableMaxHeight = "max-h-96";
  
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
          <div className="mb-6">
            <div className="flex items-center gap-2 pt-2">
              {hasMembership ? (
                <>
                  <span className="font-medium pl-4">{membershipType} Membership</span>
                  <span className="text-sm text-gray-600">Will expire at {expiryDate}</span>
                </>
              ) : (
                <span className="font-medium pl-4 text-gray-600">Not Subscribed to any Membership</span>
              )}
            </div>
          </div>

          {/* Stats Boxes */}
          <div className="flex gap-3">
          
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
            {mainTableData.length > 5 && (
              <a 
                href="#" 
                onClick={handleSeeAllMain} 
                className="text-sm text-blue-600 hover:underline"
              >
                {showAllMain ? "show less" : `see all (${mainTableData.length})`}
              </a>
            )}
          </div>
          <div className={showAllMain ? `overflow-y-auto ${scrollableMaxHeight}` : ""}>
            <Table 
              data={displayMainData}
              secondColumnName="Name"
              onView={onViewMainTable}
              cardClassName="bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section - Different configurations based on view */}
      {showBottomTables && !showTestsAndCertificatesOnly && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{leftTableTitle}</h2>
              {leftTableData.length > 5 && (
                <a 
                  href="#" 
                  onClick={handleSeeAllLeft} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAllLeft ? "show less" : `see all (${leftTableData.length})`}
                </a>
              )}
            </div>
            <div className={showAllLeft ? `overflow-y-auto ${scrollableMaxHeight}` : ""}>
              <Table 
                data={displayLeftData}
                secondColumnName="Name"
                onView={onViewLeftTable}
                cardClassName="bg-gray-50"
              />
            </div>
          </div>

          {/* Right Table */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-medium">{rightTableTitle}</h2>
              {rightTableData.length > 5 && (
                <a 
                  href="#" 
                  onClick={handleSeeAllRight} 
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAllRight ? "show less" : `see all (${rightTableData.length})`}
                </a>
              )}
            </div>
            <div className={showAllRight ? `overflow-y-auto ${scrollableMaxHeight}` : ""}>
              <Table 
                data={displayRightData}
                secondColumnName="Name"
                onView={onViewRightTable}
                cardClassName="bg-gray-50"
              />
            </div>
          </div>
        </div>
      )}

      {/* Single Bottom Table - Full Width */}
      {(!showBottomTables || showTestsAndCertificatesOnly) && (singleBottomTableTitle || leftTableTitle) && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">{singleBottomTableTitle || leftTableTitle}</h2>
            {(singleBottomTableData || leftTableData).length > 5 && (
              <a 
                href="#" 
                onClick={handleSeeAllSingle} 
                className="text-sm text-blue-600 hover:underline"
              >
                {showAllSingle ? "show less" : `see all (${(singleBottomTableData || leftTableData).length})`}
              </a>
            )}
          </div>
          <div className={showAllSingle ? `overflow-y-auto ${scrollableMaxHeight}` : ""}>
            <Table 
              data={displaySingleData}
              secondColumnName="Name"
              onView={onViewSingleBottomTable || onViewLeftTable}
              cardClassName="bg-gray-50"
            />
          </div>
        </div>
      )}
    </div>
  );
}