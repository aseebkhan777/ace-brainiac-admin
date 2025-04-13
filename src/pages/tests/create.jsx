import { useState } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { Trash2, Upload, Check, Loader, X } from "lucide-react"
import { Dropdown } from "../../components/Dropdown"
import useUpdateTest from "../../hooks/useUpdateTests"
import useAddQuestion from "../../hooks/useAddQuestion"

export default function CreateTests() {
    const { id: testId } = useParams() // Get testId from URL parameters
    const [activeTab, setActiveTab] = useState("questions")
    const [questions, setQuestions] = useState([
        {
            id: 1,
            question: "",
            options: [
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
            ],
            attachments: [],
            uploading: false,
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

    const [submitting, setSubmitting] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: "", type: "" })

    // Import our custom hooks
    const { addBulkQuestions, loading: addingQuestions, error: addQuestionsError } = useAddQuestion()
    const { updateTest, loading: updatingTest, error: updateTestError } = useUpdateTest(testId)

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

    const addOption = (qIndex) => {
        setQuestions((prev) =>
            prev.map((q, index) => (index === qIndex ? { ...q, options: [...q.options, { text: "", correct: false }] } : q)),
        )
    }

    const addNewQuestion = () => {
        setQuestions((prev) => [
            ...prev,
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
            },
        ])
    }

    const removeQuestion = (id) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id))
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

    // Modified function to submit all questions
    const handleSubmitAllQuestions = async () => {
        // Validate all questions before submitting
        const validQuestions = questions.filter(q => q.question.trim() !== "");

        if (validQuestions.length === 0) {
            showNotification("No valid questions to submit", "error");
            return false;
        }

        // Check each question for validity
        for (const q of validQuestions) {
            // Check if question text is provided
            if (!q.question.trim()) {
                showNotification("Question text cannot be empty", "error");
                return false;
            }

            // Check if options array has at least 4 items
            if (q.options.length < 4) {
                showNotification("At least 4 options are required for each question", "error");
                return false;
            }

            // Check if all options have text
            const emptyOptionIndex = q.options.findIndex(
                option => option.text === undefined || option.text === null || option.text.trim() === ""
            );

            if (emptyOptionIndex !== -1) {
                showNotification(`Question "${q.question.substring(0, 20)}...": Option ${emptyOptionIndex + 1} is empty`, "error");
                return false;
            }

            // Check if at least one option is marked as correct
            const hasCorrectOption = q.options.some(option => option.correct);
            if (!hasCorrectOption) {
                showNotification(`Question "${q.question.substring(0, 20)}...": At least one option must be correct`, "error");
                return false;
            }
        }

        setSubmitting(true);

        // Format the questions data for the API
        const formData = new FormData();

        // Prepare questions array in the required format
        const formattedQuestions = validQuestions.map(q => ({
            text: q.question,
            file: q.attachments.length > 0 ? q.attachments[0].file : null,
            options: q.options.map(option => ({
                text: option.text,
                is_correct: option.correct
            }))
        }));

        // For FormData approach (if your API needs multipart/form-data)
        formData.append('questions', JSON.stringify(formattedQuestions.map(q => ({
            text: q.text,
            options: q.options
        }))));

        // Add files separately if needed
        formattedQuestions.forEach((q, index) => {
            if (q.file) {
                formData.append(`files[${index}]`, q.file);
            }
        });

        // For JSON approach (if your API accepts JSON directly)
        const jsonData = {
            questions: formattedQuestions.map(q => {
                const questionData = {
                    text: q.text,
                    options: q.options
                };

                if (q.file) {
                    questionData.file = q.file.name; // This might need adjustment based on your backend
                }

                return questionData;
            })
        };

        // Choose either formData or jsonData based on your API requirements
        const success = await addBulkQuestions(testId, jsonData);

        if (success) {
            showNotification("All questions added successfully", "success");
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
                }
            ]);
        } else {
            showNotification(addQuestionsError || "Failed to add questions", "error");
        }

        setSubmitting(false);
        return success;
    }

    // Function to handle saving settings - Updated with validation
    const handleSaveSettings = async () => {
        if (!settings.title.trim()) {
            showNotification("Title is required", "error");
            return false;
        }

        // Added: Validate subject is selected
        if (!settings.subject) {
            showNotification("Subject is required", "error");
            return false;
        }

        // Added: Validate class is selected
        if (!settings.class) {
            showNotification("Class is required", "error");
            return false;
        }

        setSubmitting(true);

        // Format settings data as required by the API
        const settingsData = {
            title: settings.title,
            subject: settings.subject,
            class: settings.class,
            totalMarks: Number.parseInt(settings.totalMarks) || 0,
            status: settings.status,
            certification_available: settings.certification_available,
        };

        const success = await updateTest(settingsData);

        if (success) {
            showNotification("Settings saved successfully", "success");
        } else {
            showNotification(updateTestError || "Failed to save settings", "error");
        }

        setSubmitting(false);
        return success;
    }

    // Function to handle saving the entire test
    const handleSaveTest = async () => {
        if (activeTab === "questions") {
            return await handleSubmitAllQuestions();
        } else {
            return await handleSaveSettings();
        }
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
                                : "bg-yellow-500"
                            } text-white`}
                    >
                        {notification.message}
                    </div>
                )}

                <div className="w-full max-w-4xl bg-secondary py-14 px-4 md:px-9 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl md:text-2xl font-semibold">Create Test</h1>
                        <Button
                            className="flex items-center bg-primary text-white px-4 py-2 rounded-lg text-sm md:text-base"
                            onClick={handleSaveTest}
                            disabled={submitting || addingQuestions || updatingTest}
                        >
                            {submitting || addingQuestions || updatingTest ? (
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
                                                <button onClick={() => removeQuestion(q.id)} className="absolute top-2 right-2 text-red-500">
                                                    <Trash2 size={18} />
                                                </button>
                                            )}

                                            <label className="block font-medium mb-1">Question</label>
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
                                        <Dropdown
                                            placeholder="Select Grade *"
                                            options={classOptions}
                                            value={settings.class}
                                            onChange={(newValue) => setSettings({ ...settings, class: newValue })}
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