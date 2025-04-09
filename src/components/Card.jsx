export default function Card({ children, width = "w-full", height = "h-auto", className = "" }) {
    return (
      <div className={`p-3 border border-primary rounded-lg shadow-sm ${width} ${height} ${className} bg-white`.replace("bg-white", "").trim()}>
        {children}
      </div>
    );
  }