export function Tabs({ children }) {
    return <div className="mb-4">{children}</div>;
  }
  
  export function TabsList({ children }) {
    return <div className="flex border-b mb-4">{children}</div>;
  }
  
  export function TabsTrigger({ children, active, onClick, className = "" }) {
    return (
      <button
        onClick={onClick}
        className={`px-4 py-2 ${active ? "border-b-2 border-primary font-semibold" : ""} ${className}`}
      >
        {children}
      </button>
    );
  }