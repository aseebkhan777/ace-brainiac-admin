import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { Trash2, Upload, Check, Loader, X } from "lucide-react"
import { Dropdown } from "../../components/Dropdown"
import useUpdateTest from "../../hooks/useUpdateTests"
import useAddQuestion from "../../hooks/useAddQuestion"
import useGetTest from "../../hooks/useGetTest"
import useCreateTest from "../../hooks/useCreateTests"
import useDeleteQuestion from "../../hooks/useDeleteQuestion" // Import the new hook
import ClassDropdown from "../../components/ClassDropdown"
import { LoadingSpinner } from "../../components/Loader"

export default function CreateTests() {
    const navigate = useNavigate();
    const { id: testId } = useParams() // Get testId from URL parameters
    const isEditMode = !!testId;
    const [activeTab, setActiveTab] = useState("questions")
    const [questions, setQuestions] = useState([
        {
            id: Date.now(), // Use unique ID for new questions
            question: "",
            options: [
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
            ],
            attachments: [],
            uploading: false,
            isExisting: false, // Track if this is an existing question from the database
        },
    ])

    const [settings, setSettings] = useState({
        title: "",
        subject: "",
        class: "",
        totalMarks: "",
        status: "DRAFT", // default status
        certification_available: false, // default value
    })

    // Track removed questions for bulk operations (only needed for new questions now)
    const [removedQuestions, setRemovedQuestions] = useState([])

    const [submitting, setSubmitting] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: "", type: "" })

    // Import our custom hooks
    const { test, loading: fetchingTest, error: fetchTestError } = useGetTest(testId)
    const { createTest, loading: creatingTest } = useCreateTest()
    const { addBulkQuestions, loading: addingQuestions, error: addQuestionsError } = useAddQuestion()
    const { updateTest, loading: updatingTest, error: updateTestError } = useUpdateTest(testId)
    const { deleteQuestion, loading: deletingQuestion, error: deleteQuestionError } = useDeleteQuestion() // Add the new hook

    // Dropdown options for subjects
    const subjectOptions = [
        { value: "Math", label: "Math" },
        { value: "Science", label: "Science" },
        { value: "History", label: "History" }
    ]

    // Dropdown options for classes
    const classOptions = [
        { value: "Grade 1", label: "Grade 1" },
        { value: "Grade 2", label: "Grade 2" },
        { value: "Grade 3", label: "Grade 3" }
    ]

    // Dropdown options for status
    const statusOptions = [
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" }
    ]

    // Show notification function
    const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 3000)
    }

    // Initialize page with test data when in edit mode
    useEffect(() => {
        if (test) {
            // Populate settings - Fixed certificationAvailable property mapping
            setSettings({
                title: test.title || "",
                subject: test.subject || "",
                class: test.class || "",
                totalMarks: test.totalMarks?.toString() || "",
                status: test.status || "DRAFT",
                certification_available: test.certificationAvailable || false, // Fixed property name to match API response
            })

            // Populate questions if they exist
            if (test.questions && test.questions.length > 0) {
                const formattedQuestions = test.questions.map(q => ({
                    id: q.id, // Use the actual ID from the database
                    question: q.question || "",
                    options: q.options?.map(opt => ({
                        text: opt.option || "",
                        correct: opt.is_correct || false
                    })) || [
                            { text: "", correct: false },
                            { text: "", correct: false },
                            { text: "", correct: false },
                            { text: "", correct: false },
                        ],
                    attachments: q.imageUrl ? [{ id: Date.now(), name: q.imageUrl, file: null }] : [],
                    uploading: false,
                    isExisting: true, // Mark as existing question
                }));
                setQuestions(formattedQuestions);
            }
        }
    }, [test]);

    // Handle error from fetching test
    useEffect(() => {
        if (fetchTestError) {
            showNotification(`Failed to load test: ${fetchTestError}`, "error");
        }
    }, [fetchTestError]);

    // Monitor delete question error
    useEffect(() => {
        if (deleteQuestionError) {
            showNotification(`Failed to delete question: ${deleteQuestionError}`, "error");
        }
    }, [deleteQuestionError]);

    const addOption = (qIndex) => {
        setQuestions((prev) =>
            prev.map((q, index) => (index === qIndex ? { ...q, options: [...q.options, { text: "", correct: false }] } : q)),
        )
    }

    const addNewQuestion = () => {
        setQuestions((prev) => [
            ...prev,
            {
                id: Date.now(), // Use timestamp as temporary ID
                question: "",
                options: [
                    { text: "", correct: false },
                    { text: "", correct: false },
                    { text: "", correct: false },
                    { text: "", correct: false },
                ],
                attachments: [],
                uploading: false,
                isExisting: false, // Mark as new question
            },
        ])
    }

    // Modified removeQuestion function to handle both new and existing questions
    const removeQuestion = async (id, isExisting) => {
        if (isExisting && testId) {
            // For existing questions, send DELETE request to API
            setSubmitting(true)
            const success = await deleteQuestion(testId, id)
            setSubmitting(false)

            if (success) {
                showNotification("Question deleted successfully", "success")
                // Remove from UI after successful deletion
                setQuestions(prev => prev.filter(q => q.id !== id))
            } else {
                showNotification(deleteQuestionError || "Failed to delete question", "error")
            }
        } else {
            // For new questions, just remove from UI
            setQuestions(prev => prev.filter(q => q.id !== id))
        }
    }

    const handleFileUpload = (qIndex, e) => {
        const file = e.target.files[0]
        if (!file) return

        if (questions[qIndex].uploading) return

        // Set uploading state to true
        setQuestions((prev) => prev.map((q, index) => (index === qIndex ? { ...q, uploading: true } : q)))

        setTimeout(() => {
            setQuestions((prev) =>
                prev.map((q, index) =>
                    index === qIndex
                        ? {
                            ...q,
                            attachments: [...q.attachments, { id: Date.now(), file, name: file.name }],
                            uploading: false,
                        }
                        : q,
                ),
            )

            e.target.value = "" // Reset file input
        }, 1500)
    }

    const removeAttachment = (qIndex, attachmentId) => {
        setQuestions((prev) =>
            prev.map((q, index) =>
                index === qIndex
                    ? { ...q, attachments: q.attachments.filter((attachment) => attachment.id !== attachmentId) }
                    : q,
            ),
        )
    }

    // Helper function to validate a question
    const validateQuestion = (q) => {
        // Check if question text is provided
        if (!q.question.trim()) {
            showNotification("Question text cannot be empty", "error")
            return false
        }

        // Check if options array has at least 4 items
        if (q.options.length < 4) {
            showNotification("At least 4 options are required for each question", "error")
            return false
        }

        // Check if all options have text
        const emptyOptionIndex = q.options.findIndex(
            option => option.text === undefined || option.text === null || option.text.trim() === ""
        )

        if (emptyOptionIndex !== -1) {
            showNotification(`Question "${q.question.substring(0, 20)}...": Option ${emptyOptionIndex + 1} is empty`, "error")
            return false
        }

        // Check if at least one option is marked as correct
        const hasCorrectOption = q.options.some(option => option.correct)
        if (!hasCorrectOption) {
            showNotification(`Question "${q.question.substring(0, 20)}...": At least one option must be correct`, "error")
            return false
        }

        return true
    }

    // Format question for the bulk API
    const formatQuestionForBulkApi = (q) => {
        // Include question ID for existing questions to trigger update
        return {
            ...(q.isExisting ? { id: q.id } : {}), // Only include ID if it's an existing question
            text: q.question,
            file: q.attachments.length > 0 ? q.attachments[0].file : null,
            options: q.options.map(option => ({
                text: option.text,
                is_correct: option.correct
            }))
        }
    }

    // Simplified function to submit all questions via bulk API
    const handleSubmitAllQuestions = async () => {
        // Validate all questions before submitting
        const validQuestions = questions.filter(q => validateQuestion(q))

        if (validQuestions.length === 0) {
            showNotification("No valid questions to submit", "error")
            return false
        }

        setSubmitting(true)

        let currentTestId = testId
        let success = true

        // If we're not in edit mode, create a new test first
        if (!isEditMode) {
            currentTestId = await createTest()
            if (!currentTestId) {
                showNotification("Failed to create test", "error")
                setSubmitting(false)
                return false
            }
        }

        // Format all questions for the bulk API
        const formattedQuestions = validQuestions.map(formatQuestionForBulkApi)

        // We no longer need to include removed_questions since we're handling deletion individually
        const jsonData = {
            questions: formattedQuestions
        }

        // Use the bulk API to handle both new and existing questions
        success = await addBulkQuestions(currentTestId, jsonData)

        if (success) {
            showNotification("All questions saved successfully", "success")

            if (!isEditMode) {
                navigate(`/create-test/${currentTestId}`)

                // Reset the questions form
                setQuestions([
                    {
                        id: Date.now(),
                        question: "",
                        options: [
                            { text: "", correct: false },
                            { text: "", correct: false },
                            { text: "", correct: false },
                            { text: "", correct: false },
                        ],
                        attachments: [],
                        uploading: false,
                        isExisting: false,
                    }
                ])
            } else {
                // Update the state to reflect all questions as existing
                setQuestions(prev => prev.map(q => ({ ...q, isExisting: true })))
            }
        } else {
            showNotification(addQuestionsError || "Failed to save questions", "error")
        }

        setSubmitting(false)
        return success
    }

    // Function to handle saving settings - Updated to map property correctly for API
    const handleSaveSettings = async () => {
        if (!settings.title.trim()) {
            showNotification("Title is required", "error")
            return false
        }

        // Added: Validate subject is selected
        if (!settings.subject) {
            showNotification("Subject is required", "error")
            return false
        }

        // Added: Validate class is selected
        if (!settings.class) {
            showNotification("Class is required", "error")
            return false
        }

        setSubmitting(true)

        let currentTestId = testId

        // If we're not in edit mode, create a new test first
        if (!isEditMode) {
            currentTestId = await createTest()
            if (!currentTestId) {
                showNotification("Failed to create test", "error")
                setSubmitting(false)
                return false
            }
        }

        // Format settings data as required by the API
        // Format settings data as required by the API
        const settingsData = {
            title: settings.title,
            subject: settings.subject,
            class: settings.class,
            totalMarks: Number.parseInt(settings.totalMarks) || 0,
            status: settings.status,
            // Be explicit with the boolean conversion
            certificationAvailable: settings.certification_available === true
        }

        // Use the existing updateTest function from the hook already initialized at the top level
        const success = await updateTest(settingsData)

        if (success) {
            showNotification("Settings saved successfully", "success")

            // If we created a new test, redirect to edit mode
            if (!isEditMode) {
                navigate(`/create-test/${currentTestId}`)
            }
        } else {
            showNotification(updateTestError || "Failed to save settings", "error")
        }

        setSubmitting(false)
        return success
    }

    // Function to handle saving the entire test
    const handleSaveTest = async () => {
        if (activeTab === "questions") {
            return await handleSubmitAllQuestions()
        } else {
            return await handleSaveSettings()
        }
    }

    // Show loading state while fetching test data in edit mode
    if (isEditMode && fetchingTest) {
        return (
            <div className="flex min-h-screen bg-white justify-center items-center">
                <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>
                
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-white">
            {/* Main Content */}
            <div className="flex-1 flex flex-col pt-14 items-center p-4 md:pt-20 md:px-9 bg-white min-h-screen">
                {/* Notification */}
                {notification.show && (
                    <div
                        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${notification.type === "success"
                            ? "bg-green-500"
                            : notification.type === "error"
                                ? "bg-red-500"
                                : notification.type === "info"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                            } text-white`}
                    >
                        {notification.message}
                    </div>
                )}

                <div className="w-full max-w-4xl bg-secondary py-14 px-4 md:px-9 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl md:text-2xl font-semibold">
                            {isEditMode ? "Edit Test" : "Create Test"}
                        </h1>
                        <Button
                            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm md:text-base"
                            onClick={handleSaveTest}
                            disabled={submitting || addingQuestions || updatingTest || creatingTest || deletingQuestion}
                        >
                            {submitting || addingQuestions || updatingTest || creatingTest || deletingQuestion ? (
                                <>
                                    <Loader className="mr-2 animate-spin" size={18} /> Saving...
                                </>
                            ) : activeTab === "questions" ? (
                                <>
                                    <Check className="mr-2" size={18} /> Submit
                                </>
                            ) : (
                                <>
                                    <Check className="mr-2" size={18} /> Save Settings
                                </>
                            )}
                        </Button>
                    </div>

                    <div className="p-4 bg-white rounded-lg">
                        {/* Tabs */}
                        <Tabs>
                            <div className="sticky top-0 z-10 bg-white ">
                                <TabsList className="flex gap-4 border-b pb-2">
                                    <TabsTrigger
                                        className={`text-black pb-2 ${activeTab === "questions" ? "border-b-2 border-primary" : ""}`}
                                        onClick={() => setActiveTab("questions")}
                                    >
                                        Questions
                                    </TabsTrigger>
                                    <TabsTrigger
                                        className={`text-black pb-2 ${activeTab === "settings" ? "border-b-2 border-primary" : ""}`}
                                        onClick={() => setActiveTab("settings")}
                                    >
                                        Settings
                                    </TabsTrigger>
                                </TabsList>
                            </div>

                            {activeTab === "questions" && (
                                <div>
                                    {questions.map((q, qIndex) => (
                                        <div key={q.id} className="relative mb-6 p-4 border rounded-lg bg-white">
                                            {questions.length > 1 && (
                                                <button
                                                    onClick={() => removeQuestion(q.id, q.isExisting)}
                                                    className="absolute top-2 right-2 text-red-500"
                                                    disabled={deletingQuestion}
                                                >
                                                    {deletingQuestion && q.isExisting ? (
                                                        <Loader size={18} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            )}

                                            {/* Badge to indicate if this is an existing question */}
                                            {q.isExisting && (
                                                <span className="absolute top-2 left-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                                    Existing
                                                </span>
                                            )}

                                            <label className="block font-medium mb-1 mt-6">Question</label>
                                            <textarea
                                                placeholder="Enter your question"
                                                value={q.question}
                                                className="w-full p-2 border rounded-lg min-h-[80px]"
                                                onChange={(e) => {
                                                    setQuestions((prev) => {
                                                        const updatedQuestions = [...prev]
                                                        updatedQuestions[qIndex].question = e.target.value
                                                        return updatedQuestions
                                                    })
                                                }}
                                            />

                                            <div className="mt-2">
                                                <input
                                                    type="file"
                                                    id={`file-upload-${q.id}`}
                                                    className="hidden"
                                                    onChange={(e) => handleFileUpload(qIndex, e)}
                                                    disabled={q.uploading}
                                                />
                                                <label
                                                    htmlFor={`file-upload-${q.id}`}
                                                    className={`flex items-center text-sm border p-2 rounded-lg ${q.uploading ? "cursor-not-allowed bg-gray-100" : "cursor-pointer bg-gray-50"}`}
                                                >
                                                    {q.uploading ? (
                                                        <>
                                                            <div className="mr-2 animate-spin">
                                                                <Loader size={18} className="text-primary" />
                                                            </div>
                                                            <span>Uploading...</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload className="mr-2" size={18} />
                                                            <span>Upload Question Attachment</span>
                                                        </>
                                                    )}
                                                </label>
                                                {q.uploading && (
                                                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary animate-pulse" style={{ width: "70%" }}></div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Display Attachments */}
                                            {q.attachments.length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium mb-2">Attachments:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {q.attachments.map((attachment) => (
                                                            <div
                                                                key={attachment.id}
                                                                className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm border"
                                                            >
                                                                <span className="truncate max-w-[150px]">{attachment.name}</span>
                                                                <button
                                                                    onClick={() => removeAttachment(qIndex, attachment.id)}
                                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                {q.options.map((option, oIndex) => (
                                                    <div key={oIndex} className="flex items-center space-x-2 mb-2">
                                                        <Input
                                                            placeholder={`Option ${oIndex + 1}`}
                                                            value={option.text || ""}
                                                            className="flex-1 bg-white"
                                                            onChange={(e) => {
                                                                // Direct state update with explicit new array creation
                                                                const newQuestions = [...questions]
                                                                newQuestions[qIndex].options[oIndex].text = e.target.value
                                                                setQuestions(newQuestions)
                                                            }}
                                                        />
                                                        <input
                                                            type="checkbox"
                                                            checked={option.correct}
                                                            onChange={() => {
                                                                setQuestions((prev) =>
                                                                    prev.map((q, index) =>
                                                                        index === qIndex
                                                                            ? {
                                                                                ...q,
                                                                                options: q.options.map((opt, idx) =>
                                                                                    idx === oIndex ? { ...opt, correct: !opt.correct } : opt,
                                                                                ),
                                                                            }
                                                                            : q,
                                                                    ),
                                                                )
                                                            }}
                                                            className="accent-primary w-4 h-4"
                                                        />
                                                        <span>Correct</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <Button onClick={() => addOption(qIndex)} variant="outline" className="mt-2">
                                                + Add Option
                                            </Button>
                                        </div>
                                    ))}

                                    {/* Add new question button */}
                                    <div className="flex justify-start mt-4">
                                        <Button onClick={addNewQuestion} variant="outline" className="text-black px-4 py-2 text-sm rounded">
                                            + Add new question
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {activeTab === "settings" && (
                                <div className="p-4 bg-white rounded-lg">
                                    <Input
                                        placeholder="Title of this Test"
                                        value={settings.title}
                                        className="w-full mb-3 bg-white"
                                        onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                                    />

                                    {/* Subject Dropdown */}
                                    <div className="mb-3">
                                        <Dropdown
                                            placeholder="Select Subject *"
                                            options={subjectOptions}
                                            value={settings.subject}
                                            onChange={(newValue) => setSettings({ ...settings, subject: newValue })}
                                            className="w-full bg-white"
                                        />
                                    </div>

                                    {/* Class Dropdown */}
                                    <div className="mb-3">
                                        <ClassDropdown
                                            value={settings.class}
                                            onChange={(value) => {
                                                // Handle both event objects and direct values
                                                if (value && value.target) {
                                                    // It's an event object
                                                    setSettings({ ...settings, class: value.target.value });
                                                } else if (value === null || value === undefined) {
                                                    // It's a null/undefined value, set empty string to avoid "undefined" in dropdown
                                                    setSettings({ ...settings, class: "" });
                                                } else {
                                                    // It's a direct value (string)
                                                    setSettings({ ...settings, class: value });
                                                }

                                                // Log the value for debugging
                                                // console.log("New class value:", value && value.target ? value.target.value : value);
                                            }}
                                            name="class"
                                            required={true}
                                            className="w-full bg-white"
                                        />
                                    </div>

                                    <Input
                                        placeholder="Total Marks"
                                        value={settings.totalMarks}
                                        type="number"
                                        className="w-full mb-3 bg-white"
                                        onChange={(e) => setSettings({ ...settings, totalMarks: e.target.value })}
                                    />

                                    {/* Status Dropdown */}
                                    <div className="mb-3">
                                        <Dropdown
                                            placeholder="Select Status"
                                            options={statusOptions}
                                            value={settings.status}
                                            onChange={(newValue) => setSettings({ ...settings, status: newValue })}
                                            className="w-full bg-white"
                                        />
                                    </div>

                                    <div className="flex items-center mb-3">
                                        <input
                                            type="checkbox"
                                            id="certification"
                                            checked={settings.certification_available}
                                            onChange={(e) => setSettings({ ...settings, certification_available: e.target.checked })}
                                            className="accent-primary w-4 h-4 mr-2"
                                        />
                                        <label htmlFor="certification">Certification Available</label>
                                    </div>
                                </div>
                            )}
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}