"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { Check, X, Info, AlertTriangle } from "lucide-react";

// Types
type ToastType = "success" | "error" | "info" | "warning";
type ToastMessage = {
  id: number;
  message: string;
  type: ToastType;
};

// Context
const ToastContext = createContext<{
  showToast: (message: string, type?: ToastType) => void;
}>({
  showToast: () => {},
});

// Hook to use toast
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Show toast
  const showToast = (message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3500);
  };

  // Get icon based on type
  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <Check className="w-4 h-4" />;
      case "error":
        return <X className="w-4 h-4" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4" />;
      case "info":
        return <Info className="w-4 h-4" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  // Get color based on type
  const getColor = (type: ToastType) => {
    switch (type) {
      case "success":
        return "bg-green-500";
      case "error":
        return "bg-red-500";
      case "warning":
        return "bg-yellow-500";
      case "info":
        return "bg-blue-500";
      default:
        return "bg-green-500";
    }
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 px-4 py-3 ${getColor(toast.type)} text-white rounded-xl shadow-2xl animate-slide-in`}
          >
            {getIcon(toast.type)}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-2 opacity-70 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}