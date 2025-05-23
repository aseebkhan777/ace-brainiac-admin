import { useState } from "react";
import Button from "./Button";
import Card from "./Card";
import { X } from "lucide-react";

export default function AddClassModal({ isOpen, onClose, onAddSuccess }) {
  const [className, setClassName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!className.trim()) {
      setError("Class name is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // We'll use the hook we're about to create
      const success = await onAddSuccess(className);
      
      if (success) {
        setClassName("");
        onClose();
      }
    } catch (err) {
      setError(err.message || "Failed to add class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="w-full max-w-lg mx-4">
        <Card className="bg-secondary p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">Add New Class</h2>
            <Button 
              variant="ghost" 
              className="p-1 h-auto text-white" 
              onClick={onClose}
            >
              <X size={20} />
            </Button>
          </div>
          
          <Card className="bg-white p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="className" className="text-sm font-medium">
                  Class Name
                </label>
                <input
                  id="className"
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Enter class name"
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  type="button" 
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button 
                className="text-white"
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Adding..." : "Add Class"}
                </Button>
              </div>
            </form>
          </Card>
        </Card>
      </div>
    </div>
  );
}