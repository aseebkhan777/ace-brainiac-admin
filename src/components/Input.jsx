export default function Input({ placeholder, className, value, onChange, ...props }) {
    return (
      <input
        type="text"
        placeholder={placeholder}
        className={`border p-2 rounded-lg bg-secondary ${className}`}
        value={value} // Pass the value prop
        onChange={onChange} // Pass the onChange prop
        {...props} // Forward any additional props
      />
    );
  }