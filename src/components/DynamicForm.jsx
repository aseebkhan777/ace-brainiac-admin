import React, { useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import { Dropdown } from "./Dropdown";
import Button from "./Button";

const DynamicForm = ({ 
    title = "Create Form",
    fields = [], 
    onSubmit, 
    loading = false, 
    error = null,
    submitButtonText = "Submit",
    cancelButtonText = "Cancel",
    onCancel 
}) => {
    // Initialize form state dynamically based on fields
    const [formData, setFormData] = useState(
        Object.fromEntries(
            fields.map(field => [field.name, field.defaultValue || ''])
        )
    );

    const handleFieldChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = (fieldName, e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ 
                ...prev, 
                [`${fieldName}_uploading`]: true 
            }));

            // Simulate upload delay for UI feedback
            setTimeout(() => {
                setFormData((prev) => ({ 
                    ...prev, 
                    [fieldName]: file, 
                    [`${fieldName}_uploading`]: false 
                }));
            }, 1500);
        }
    };

    const removeFile = (fieldName) => {
        setFormData((prev) => ({ 
            ...prev, 
            [fieldName]: null 
        }));
    };

    const handleSubmit = () => {
        // Validate required fields
        const missingFields = fields
            .filter(field => field.required && !formData[field.name])
            .map(field => field.label || field.name);

        if (missingFields.length > 0) {
            toast.error(`Please fill all required fields: ${missingFields.join(", ")}`);
            return;
        }

        // Call the provided onSubmit function
        onSubmit(formData);
    };

    const renderField = (field) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'tel':
            case 'password':
                return (
                    <input
                        key={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        className="w-full mb-3 p-2 border rounded-lg bg-white"
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        disabled={loading}
                    />
                );
                
            case 'number':
                return (
                    <input
                        key={field.name}
                        type="number"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        className="w-full mb-3 p-2 border rounded-lg bg-white"
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        disabled={loading}
                    />
                );

            case 'date':
                return (
                    <input
                        key={field.name}
                        type="date"
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        className="w-full mb-3 p-2 border rounded-lg bg-white"
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        disabled={loading}
                    />
                );

            case 'textarea':
                return (
                    <textarea
                        key={field.name}
                        placeholder={field.placeholder}
                        value={formData[field.name]}
                        className="w-full mb-3 p-2 border rounded-lg bg-white"
                        onChange={(e) => handleFieldChange(field.name, e.target.value)}
                        rows={field.rows || 4}
                        disabled={loading}
                    />
                );

            case 'dropdown':
                return (
                    <div key={field.name} className="mb-3">
                        <Dropdown
                            placeholder={field.placeholder}
                            options={field.options}
                            value={formData[field.name]}
                            onChange={(value) => handleFieldChange(field.name, value)}
                            className="w-full"
                            disabled={loading}
                        />
                    </div>
                );

            case 'checkbox':
                return (
                    <div key={field.name} className="mb-3 flex items-center mt-5">
                        <input
                            type="checkbox"
                            checked={formData[field.name]}
                            onChange={() => handleFieldChange(field.name, !formData[field.name])}
                            className="accent-primary w-4 h-4"
                            disabled={loading}
                        />
                        <span className="ml-2 text-sm">{field.label}</span>
                    </div>
                );

            case 'file':
                return (
                    <div key={field.name} className="mt-3">
                        <input
                            type="file"
                            id={`file-upload-${field.name}`}
                            className="hidden"
                            accept={field.accept || "*"}
                            onChange={(e) => handleFileUpload(field.name, e)}
                            disabled={loading}
                        />
                        <label
                            htmlFor={`file-upload-${field.name}`}
                            className={`flex items-center text-sm border p-2 rounded-lg cursor-pointer bg-gray-50 ${
                                loading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            <Upload className="mr-2" size={18} />
                            <span>{field.placeholder}</span>
                        </label>

                        {/* Upload Loader */}
                        {formData[`${field.name}_uploading`] && (
                            <div className="mt-2 text-sm text-white bg-primary px-3 py-1 rounded-lg inline-block">
                                Uploading...
                            </div>
                        )}

                        {/* Display uploaded file */}
                        {formData[field.name] && !formData[`${field.name}_uploading`] && (
                            <div className="mt-2 flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm border">
                                <span className="truncate max-w-[200px]">{formData[field.name].name}</span>
                                <button 
                                    onClick={() => removeFile(field.name)} 
                                    className="ml-2 text-red-500 hover:text-red-700"
                                    disabled={loading}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="w-full bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">{title}</h2>

            {/* Error message */}
            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Dynamic Fields Rendering */}
            {fields.map(field => (
                <div key={field.name}>
                    {field.sectionTitle && (
                        <h3 className="text-md font-medium mt-6 mb-3">{field.sectionTitle}</h3>
                    )}
                    {renderField(field)}
                </div>
            ))}

            {/* Footer: Action Buttons */}
            <div className="mt-3 flex justify-end items-center space-x-4">
                {onCancel && (
                    <Button 
                        onClick={onCancel} 
                        className="text-gray-600 border border-gray-300 px-6 py-2 rounded-lg"
                        disabled={loading}
                    >
                        {cancelButtonText}
                    </Button>
                )}

                {/* Create/Submit Button */}
                <Button 
                    onClick={handleSubmit} 
                    className={`bg-primary text-white px-6 py-2 rounded-lg mt-2 ${
                        loading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                >
                    {loading ? "Submitting..." : submitButtonText}
                </Button>
            </div>
        </div>
    );
};

export default DynamicForm;