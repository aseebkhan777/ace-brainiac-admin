import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "../../components/Tabs"
import Input from "../../components/Input"
import Button from "../../components/Button"
import { Trash2, Upload, Check, Loader, X, AlertCircle, ExternalLink, Eye } from "lucide-react"
import { Dropdown } from "../../components/Dropdown"
import useUpdateTest from "../../hooks/useUpdateTests"
import useAddQuestion from "../../hooks/useAddQuestion"
import useGetTest from "../../hooks/useGetTest"
import useCreateTest from "../../hooks/useCreateTests"
import useDeleteQuestion from "../../hooks/useDeleteQuestion"
import ClassDropdown from "../../components/ClassDropdown"
import SubjectDropdown from "../../components/SubjectDropdown"
import { LoadingSpinner } from "../../components/Loader"

export default function CreateTests() {
    const navigate = useNavigate();
    const { id: testId } = useParams()
    const isEditMode = !!testId;
    const [activeTab, setActiveTab] = useState("questions")
    const [questions, setQuestions] = useState([
        {
            id: Date.now(),
            question: "",
            options: [
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
                { text: "", correct: false },
            ],
            attachment: null,
            uploading: false,
            isExisting: false,
        },
    ])

    const [settings, setSettings] = useState({
        title: "",
        subject: "",
        class: "",
        totalMarks: "",
        status: "DRAFT",
        certification_available: false,
    })

    const [removedQuestions, setRemovedQuestions] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [notification, setNotification] = useState({ show: false, message: "", type: "" })
    const [previewImage, setPreviewImage] = useState(null)

    const { test, loading: fetchingTest, error: fetchTestError } = useGetTest(testId)
    const { createTest, loading: creatingTest } = useCreateTest()
    const { addBulkQuestions, loading: addingQuestions, error: addQuestionsError } = useAddQuestion()
    const { updateTest, loading: updatingTest, error: updateTestError } = useUpdateTest(testId)
    const { deleteQuestion, loading: deletingQuestion, error: deleteQuestionError } = useDeleteQuestion()


    const statusOptions = [
        { value: "DRAFT", label: "Draft" },
        { value: "PUBLISHED", label: "Published" }
    ]

    const showNotification = (message, type) => {
        setNotification({ show: true, message, type })
        setTimeout(() => setNotification({ show: false, message: "", type: "" }), 5000)
    }

    useEffect(() => {
        if (test) {
            setSettings({
                title: test.title || "",
                subject: test.subject || "",
                class: test.class || "",
                totalMarks: test.totalMarks?.toString() || "",
                status: test.status || "DRAFT",
                certification_available: test.certificationAvailable || false,
            })

            if (test.questions && test.questions.length > 0) {
                const formattedQuestions = test.questions.map(q => ({
                    id: q.id,
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
                    attachment: q.imageUrl ? { id: Date.now(), name: q.imageUrl, file: null, url: q.imageUrl } : null,
                    uploading: false,
                    isExisting: true,
                }));
                setQuestions(formattedQuestions);
            }
        }
    }, [test]);


    useEffect(() => {
        if (fetchTestError) {
            showNotification(`Failed to load test: ${fetchTestError}`, "error");
        }
    }, [fetchTestError]);

    useEffect(() => {
        if (deleteQuestionError) {
            showNotification(`Failed to delete question: ${deleteQuestionError}`, "error");
        }
    }, [deleteQuestionError]);

    useEffect(() => {
        if (addQuestionsError) {
            showNotification(`Error saving questions: ${addQuestionsError}`, "error");
        }
    }, [addQuestionsError]);

    useEffect(() => {
        if (updateTestError) {
            showNotification(`Error updating test: ${updateTestError}`, "error");
        }
    }, [updateTestError]);

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
                attachment: null,
                uploading: false,
                isExisting: false,
            },
        ])
    }

    const removeQuestion = async (e, id, isExisting) => {
        // Prevent form submission
        e.preventDefault();
        e.stopPropagation();
        
        if (isExisting && testId) {
            setSubmitting(true)
            const success = await deleteQuestion(testId, id)
            setSubmitting(false)

            if (success) {
                showNotification("Question deleted successfully", "success")
                setQuestions(prev => prev.filter(q => q.id !== id))
            } else {
                showNotification(deleteQuestionError || "Failed to delete question", "error")
            }
        } else {
            setQuestions(prev => prev.filter(q => q.id !== id))
        }
    }

    const handleFileUpload = (qIndex, e) => {
        const file = e.target.files[0]
        if (!file) return

        if (questions[qIndex].uploading) return

        
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp']

        if (!allowedTypes.includes(file.type)) {
            showNotification("Only PDF and image files are allowed", "error")
            e.target.value = ""
            return
        }

       
        setQuestions((prev) => prev.map((q, index) => (index === qIndex ? { ...q, uploading: true } : q)))

        setTimeout(() => {
            
            const objectUrl = URL.createObjectURL(file);
            
            setQuestions((prev) =>
                prev.map((q, index) =>
                    index === qIndex
                        ? {
                            ...q,
                            attachment: { 
                                id: Date.now(), 
                                file, 
                                name: file.name,
                                url: objectUrl 
                            },
                            uploading: false,
                        }
                        : q,
                ),
            )

            e.target.value = ""
        }, 1500)
    }

    const removeAttachment = (qIndex) => {
        
        if (questions[qIndex].attachment?.url && questions[qIndex].attachment?.file) {
            URL.revokeObjectURL(questions[qIndex].attachment.url);
        }
        
        setQuestions((prev) =>
            prev.map((q, index) =>
                index === qIndex
                    ? { ...q, attachment: null }
                    : q,
            ),
        )
    }

    const openImagePreview = (url) => {
        setPreviewImage(url);
    }

    const closeImagePreview = () => {
        setPreviewImage(null);
    }

    const validateQuestion = (q) => {
        if (!q.question.trim()) {
            showNotification("Question text cannot be empty", "error")
            return false
        }


        if (q.options.length < 2) {
            showNotification("At least 2 options are required for each question", "error")
            return false
        }


        const emptyOptionIndex = q.options.findIndex(
            option => option.text === undefined || option.text === null || option.text.trim() === ""
        )

        if (emptyOptionIndex !== -1) {
            showNotification(`Question "${q.question.substring(0, 20)}...": Option ${emptyOptionIndex + 1} is empty`, "error")
            return false
        }

        // Check for at least one correct option
        const hasCorrectOption = q.options.some(option => option.correct)
        if (!hasCorrectOption) {
            showNotification(`Question "${q.question.substring(0, 20)}...": At least one option must be marked as correct`, "error")
            return false
        }

        return true
    }

    const formatQuestionForBulkApi = (q) => {

        const isUUID = (id) => {
            const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
            return typeof id === 'string' && regex.test(id);
        };

        const questionData = {
            text: q.question,
            file: q.attachment?.file || null,
            attachment: q.attachment,
            options: q.options.map(option => ({
                text: option.text,
                is_correct: typeof option.correct === 'boolean' ? option.correct : false
            }))
        };


        if (q.isExisting && isUUID(q.id)) {
            questionData.id = q.id;
        }

        return questionData;
    }

    const handleSubmitAllQuestions = async () => {
        // Validate all questions first
        let hasErrors = false;
        questions.forEach(q => {
            if (!validateQuestion(q)) {
                hasErrors = true;
            }
        });

        if (hasErrors) {
            return false;
        }

        const validQuestions = questions.filter(q => validateQuestion(q))

        if (validQuestions.length === 0) {
            showNotification("No valid questions to submit", "error")
            return false
        }

        setSubmitting(true)

        let currentTestId = testId
        let success = true

        if (!isEditMode) {
            currentTestId = await createTest()
            if (!currentTestId) {
                showNotification("Failed to create test", "error")
                setSubmitting(false)
                return false
            }
        }

        const formattedQuestions = validQuestions.map(formatQuestionForBulkApi)


        const jsonData = {
            questions: formattedQuestions
        }

        success = await addBulkQuestions(currentTestId, jsonData)

        if (success) {
            showNotification("All questions saved successfully", "success")

            if (!isEditMode) {
                navigate(`/create-test/${currentTestId}`)

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
                        attachment: null,
                        uploading: false,
                        isExisting: false,
                    }
                ])
            } else {
                setQuestions(prev => prev.map(q => ({ ...q, isExisting: true })))
            }
        } else {
            showNotification(addQuestionsError || "Failed to save questions", "error")
        }

        setSubmitting(false)
        return success
    }

    const handleSaveSettings = async () => {
        if (!settings.title.trim()) {
            showNotification("Title is required", "error")
            return false
        }

        if (!settings.subject) {
            showNotification("Subject is required", "error")
            return false
        }

        if (!settings.class) {
            showNotification("Class is required", "error")
            return false
        }

        setSubmitting(true)

        let currentTestId = testId

        if (!isEditMode) {
            currentTestId = await createTest()
            if (!currentTestId) {
                showNotification("Failed to create test", "error")
                setSubmitting(false)
                return false
            }
        }

        const settingsData = {
            title: settings.title,
            subject: settings.subject,
            class: settings.class,
            totalMarks: Number.parseInt(settings.totalMarks) || 0,
            status: settings.status,
            certificationAvailable: settings.certification_available === true
        }

        const success = await updateTest(settingsData)

        if (success) {
            showNotification("Settings saved successfully", "success")

            if (!isEditMode) {
                navigate(`/create-test/${currentTestId}`)
            }
        } else {
            showNotification(updateTestError || "Failed to save settings", "error")
        }

        setSubmitting(false)
        return success
    }

    const handleSaveTest = async () => {
        if (activeTab === "questions") {
            return await handleSubmitAllQuestions()
        } else {
            return await handleSaveSettings()
        }
    }

    if (isEditMode && fetchingTest) {
        return (
            <div className="flex min-h-screen bg-white justify-center items-center">
                <div className="mt-10"><LoadingSpinner size="default" color="#31473A" /></div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-white">
            <div className="flex-1 flex flex-col pt-14 items-center p-4 md:pt-20 md:px-9 bg-white min-h-screen">
                {notification.show && (
                    <div
                        className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 flex items-center ${notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "error"
                                    ? "bg-red-500"
                                    : notification.type === "info"
                                        ? "bg-blue-500"
                                        : "bg-yellow-500"
                            } text-white`}
                    >
                        {notification.type === "error" && <AlertCircle className="mr-2" size={18} />}
                        {notification.type === "success" && <Check className="mr-2" size={18} />}
                        {notification.message}
                    </div>
                )}

                {/* Image Preview Modal */}
                {previewImage && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50" onClick={closeImagePreview}>
                        <div className="relative bg-white p-4 rounded-lg max-w-4xl max-h-[90vh] overflow-auto">
                            <button 
                                className="absolute top-2 right-2 text-gray-700 hover:text-black" 
                                onClick={closeImagePreview}
                            >
                                <X size={24} />
                            </button>
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="max-w-full max-h-[80vh] object-contain"
                            />
                            <div className="mt-4 flex justify-center">
                                <a 
                                    href={previewImage} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={e => e.stopPropagation()}
                                >
                                    <ExternalLink size={18} className="mr-2" />
                                    Open in new tab
                                </a>
                            </div>
                        </div>
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
                                            {questions.length > 0 && (
                                                <button
                                                    onClick={(e) => removeQuestion(e, q.id, q.isExisting)}
                                                    className="absolute top-2 right-2 text-red-500"
                                                    disabled={deletingQuestion}
                                                    type="button" 
                                                >
                                                    {deletingQuestion && q.isExisting ? (
                                                        <Loader size={18} className="animate-spin" />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )}
                                                </button>
                                            )}

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
                                                            <span>
                                                                {q.attachment ? "Replace Attachment" : "Upload Question Attachment"}
                                                            </span>
                                                        </>
                                                    )}
                                                </label>
                                                {q.uploading && (
                                                    <div className="mt-2 h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-primary animate-pulse" style={{ width: "70%" }}></div>
                                                    </div>
                                                )}
                                            </div>

                                            {q.attachment && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium mb-2">Attachment:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        <div
                                                            className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm border"
                                                        >
                                                            <span className="truncate max-w-[150px]">{q.attachment.name}</span>
                                                            
                                                            {/* Preview button */}
                                                            {q.attachment.url && (
                                                                <button
                                                                    onClick={() => openImagePreview(q.attachment.url)}
                                                                    className="ml-2 text-blue-500 hover:text-blue-700"
                                                                    type="button"
                                                                >
                                                                    <Eye size={14} />
                                                                </button>
                                                            )}
                                                            
                                                            <button
                                                                onClick={() => removeAttachment(qIndex)}
                                                                className="ml-2 text-red-500 hover:text-red-700"
                                                                type="button"
                                                            >
                                                                <X size={14} />
                                                            </button>
                                                        </div>
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

                                            <Button 
                                                onClick={() => addOption(qIndex)} 
                                                variant="outline" 
                                                className="mt-2"
                                                type="button"
                                            >
                                                + Add Option
                                            </Button>
                                        </div>
                                    ))}

                                    <div className="flex justify-start mt-4">
                                        <Button 
                                            onClick={addNewQuestion} 
                                            variant="outline" 
                                            className="text-black px-4 py-2 text-sm rounded"
                                            type="button"
                                        >
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

                                    <div className="mb-3">
                                        <SubjectDropdown
                                            value={settings.subject}
                                            onChange={(newValue) => setSettings({ ...settings, subject: newValue })}
                                            placeholder="Select Subject *"
                                            className="w-full"
                                            bgColor="bg-white"
                                            required={true}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <ClassDropdown
                                            value={settings.class}
                                            onChange={(value) => {
                                                if (value && value.target) {
                                                    setSettings({ ...settings, class: value.target.value });
                                                } else if (value === null || value === undefined) {
                                                    setSettings({ ...settings, class: "" });
                                                } else {
                                                    setSettings({ ...settings, class: value });
                                                }
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