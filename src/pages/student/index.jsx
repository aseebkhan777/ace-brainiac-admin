import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import OuterCard from "../../components/OuterCard";
import InnerCard from "../../components/InnerCard";
import useFetchStudents from "../../hooks/useFetchStudents";

export default function StudentsPage() {
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    const navigate = useNavigate();

    // Fetch students using the custom hook
    const { students = [], loading, error } = useFetchStudents();

    // Prepare dropdown options
    const classOptions = [
        { value: "Class1", label: "Class 1" },
        { value: "Class2", label: "Class 2" }
    ];

    // Helper function to normalize dates for comparison
    const formatDateForComparison = (dateStr) => {
        if (!dateStr) return "";
        
        // Handle different date formats
        let date;
        
        // If it's in format "01 February 2000"
        if (dateStr.includes(" ")) {
            const parts = dateStr.split(" ");
            const months = {
                "January": "01", "February": "02", "March": "03", "April": "04",
                "May": "05", "June": "06", "July": "07", "August": "08",
                "September": "09", "October": "10", "November": "11", "December": "12"
            };
            const day = parts[0].padStart(2, '0');
            const month = months[parts[1]];
            const year = parts[2];
            date = `${day}/${month}/${year}`;
        } 
        // If it's already in format "DD/MM/YYYY"
        else if (dateStr.includes("/")) {
            date = dateStr;
        }
        // If it's in another format, you may need to add more conditions
        
        return date;
    };

    // Filter students based on search and dropdown filters
    const filteredStudents = students.filter(student => {
        // Search filter
        const matchesSearch = searchQuery === "" ||
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Class filter
        const matchesClass = selectedClass === "" || student.class === selectedClass;
        
        // Date filter
        let matchesDate = true;
        if (selectedDate !== "") {
            const studentFormattedDate = formatDateForComparison(student.formattedDob);
            const selectedFormattedDate = formatDateForComparison(selectedDate);
            matchesDate = studentFormattedDate === selectedFormattedDate;
        }
        
        return matchesSearch && matchesClass && matchesDate;
    });

    // Pagination logic
    const itemsPerPage = 6;
    const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
    const paginatedStudents = filteredStudents.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const handleAddStudent = () => {
        navigate("/students/create");
    };

    const handleViewStudent = (studentId) => {
        // Navigate to the student details page with the ID as a URL parameter
        navigate(`/students/${studentId}`);
    };

    const handleDateChange = (date) => {
        // Make sure we're setting the date in a consistent format
        setSelectedDate(date);
        
        // Reset to first page when changing filter
        setPage(1);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-white">
                <OuterCard
                    title="Students"
                    buttonText="+ Add Student"
                    onButtonClick={handleAddStudent}
                >
                    <InnerCard
                        searchProps={{
                            value: searchQuery,
                            onChange: (e) => {
                                setSearchQuery(e.target.value);
                                setPage(1); // Reset to first page when searching
                            },
                            placeholder: "Search students...",
                            showSearchIcon: true
                        }}
                        firstDropdownProps={{
                            value: selectedClass,
                            onChange: (e) => {
                                setSelectedClass(e.target.value);
                                setPage(1); // Reset to first page when filtering
                            },
                            label: "Class",
                            options: classOptions
                        }}
                        dateFilterProps={{
                            selectedDate: selectedDate,
                            onDateChange: handleDateChange,
                            label: "Birth Date"
                        }}
                    >
                        {/* Loading State */}
                        {loading && <div className="text-center py-4">Loading students...</div>}

                        {/* Error State */}
                        {error && <div className="text-red-500 text-center py-4">{error}</div>}

                        {/* No Students State */}
                        {!loading && !error && paginatedStudents.length === 0 && (
                            <div className="text-center py-4">No students found</div>
                        )}

                        {/* Students Cards Section */}
                        <div className="mt-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-2">
                                {paginatedStudents.map((student) => (
                                    <Card
                                        key={student.id}
                                        height="h-[220px]"
                                        className="bg-secondary w-full border-secondary"
                                    >
                                        <div className="flex justify-between items-center pb-2">
                                            <h3 className="text-sm font-semibold">{student.name}</h3>
                                            <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                    student.status === 'Inactive' ? 'bg-yellow-100 text-yellow-800' :
                                                        student.status === 'Suspended' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-800'
                                                }`}>
                                                {student.status || 'Unknown'}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Gender:</span>{student.gender}
                                            </p>
                                            <p className="text-xs flex items-center">
                                                <span className="font-medium mr-2">Class:</span>{student.class}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Email:</span> {student.email}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Date of Birth:</span> {student.formattedDob}
                                            </p>
                                            <p className="text-xs">
                                                <span className="font-medium">Phone:</span> {student.phone || 'Not provided'}
                                            </p>
                                        </div>

                                        <div className="flex justify-center gap-2 mt-3">
                                            <Button
                                                variant="secondary"
                                                className="mt-3 w-full text-xs"
                                                onClick={() => handleViewStudent(student.id)}
                                            >
                                                View Details
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* Pagination */}
                        <div className="flex justify-center items-center gap-3 mt-5">
                            <Button
                                variant="outline"
                                onClick={() => setPage(page - 1)}
                                disabled={page === 1}
                                className="px-2 py-1"
                            >
                                <ChevronLeft size={16} />
                            </Button>
                            <span className="text-sm">{page} of {totalPages || 1}</span>
                            <Button
                                variant="outline"
                                onClick={() => setPage(page + 1)}
                                disabled={page === totalPages || totalPages === 0}
                                className="px-2 py-1"
                            >
                                <ChevronRight size={16} />
                            </Button>
                        </div>
                    </InnerCard>
                </OuterCard>
            </div>
        </div>
    );
}