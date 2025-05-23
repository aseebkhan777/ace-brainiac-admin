export default function Button({ children, onClick, variant = "default", disabled, className = "", fullWidth = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md transition duration-200
                ${variant === "edit" ? "bg-[#c8f3ff] border border-[#64cffe] text-black" : ""}
                ${variant === "outline" ? "border border-gray-400 text-gray-700" : ""}
                ${variant === "secondary" ? "bg-secondary text-black border border-black" : ""}
                ${variant === "edit" ? "border border-transparent" : ""}
                ${variant === "delete" ? "bg-red-500 text-white hover:bg-red-600" : ""}
                ${variant === "default" ? "bg-primary" : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"} 
                ${fullWidth ? "w-full" : ""} 
                ${className}`}
        >
            {children}
        </button>
    );
}