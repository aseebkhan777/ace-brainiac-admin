import { useState, useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-white to-secondary px-6 py-24 sm:py-32 lg:px-8">
      <div className={`text-center transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
        <div className="relative mx-auto mb-8 h-24 w-24 overflow-hidden rounded-full bg-secondary flex items-center justify-center">
          <p className="text-4xl font-bold text-primary">404</p>
        </div>
        
        <h1 className="mt-4 text-5xl font-bold tracking-tight text-primary sm:text-7xl">
          Page not found
        </h1>
        
        <p className="mt-6 text-lg text-gray-700 max-w-md mx-auto">
          Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or never existed.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="/"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-hover transition-colors w-full sm:w-auto justify-center"
          >
            <Home size={18} />
            Go back home
          </a>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 rounded-md border border-gray-300 bg-secondary px-4 py-3 text-sm font-semibold text-primary shadow-sm hover:bg-white transition-colors w-full sm:w-auto justify-center"
          >
            <ArrowLeft size={18} />
            Go back
          </button>
        </div>
        
        <div className="mt-16 border-t border-primary pt-8">
          <p className="text-sm text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}