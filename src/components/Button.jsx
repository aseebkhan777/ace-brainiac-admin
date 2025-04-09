export default function Button({ children, onClick, variant = "default", disabled, className = "", fullWidth = false }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-md transition duration-200
                ${variant === "outline" ? "border border-gray-400 text-gray-700" : ""}
                ${variant === "secondary" ? "bg-secondary text-black border border-black"  : ""}
                ${variant === "default" ? "bg-primary " : ""}
                ${disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80"} 
                ${fullWidth ? "w-full" : ""} 
                ${className}`}
        >
            {children}
        </button>
    );
}