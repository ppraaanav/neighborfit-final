import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

const toasts: Toast[] = [];
let toastId = 0;

export const toast = {
  success: (title: string, description?: string) => {
    showToast({ type: 'success', title, description });
  },
  error: (title: string, description?: string) => {
    showToast({ type: 'error', title, description });
  },
  warning: (title: string, description?: string) => {
    showToast({ type: 'warning', title, description });
  },
  info: (title: string, description?: string) => {
    showToast({ type: 'info', title, description });
  },
};

function showToast({ type, title, description, duration = 5000 }: Omit<Toast, 'id'>) {
  const id = (toastId++).toString();
  const newToast: Toast = { id, type, title, description, duration };
  toasts.push(newToast);
  
  // Auto-remove toast after duration
  setTimeout(() => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
    }
  }, duration);
}

export function Toaster() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentToasts([...toasts]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const removeToast = (id: string) => {
    const index = toasts.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.splice(index, 1);
      setCurrentToasts([...toasts]);
    }
  };

  const getIcon = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: Toast['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {currentToasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-md ${getBackgroundColor(toast.type)} fade-in`}
        >
          {getIcon(toast.type)}
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{toast.title}</h4>
            {toast.description && (
              <p className="text-sm text-gray-600 mt-1">{toast.description}</p>
            )}
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-gray-400 hover:text-gray-600"
          >
            <XCircle className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}