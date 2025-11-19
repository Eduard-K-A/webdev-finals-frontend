import React from 'react';
import { useToast, type ToastMessage } from '../context/ToastContext';
import { CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
    const { removeToast } = useToast(); 

    // Define styles and icon based on toast type
    const baseClasses = 'p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 transform';
    let typeClasses = '';
    let Icon = Info;
    let iconClasses = '';

    switch (toast.type) {
        case 'success':
            typeClasses = 'bg-white border-green-500';
            Icon = CheckCircle;
            iconClasses = 'text-green-500';
            break;
        case 'error':
            typeClasses = 'bg-white border-red-500';
            Icon = AlertTriangle;
            iconClasses = 'text-red-500';
            break;
        case 'info':
        default:
            typeClasses = 'bg-white border-blue-500';
            Icon = Info;
            iconClasses = 'text-blue-500';
            break;
    }

    return (
        <div 
            className={`mt-4 w-full max-w-sm pointer-events-auto ring-1 ring-black ring-opacity-5 ${baseClasses} ${typeClasses}`}
        >
            <div className="flex items-start">
                {/* Icon */}
                <div className={`flex-shrink-0 ${iconClasses}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                
                {/* Content */}
                <div className="ml-3 flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{toast.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
                </div>
                
                {/* Close Button */}
                <div className="ml-4 flex-shrink-0 flex">
                    <button
                        // 2. FIX: Call removeToast with the current toast's ID
                        onClick={() => removeToast(toast.id)} 
                        className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        <span className="sr-only">Close</span>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts } = useToast();

    return (
        <div 
            aria-live="assertive" 
            className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-end z-50"
        >
            <div className="w-full flex flex-col items-end space-y-4">
                {toasts.map((toast) => (
                    // This section ensures all toasts stack correctly in the top-right corner.
                    <div 
                        key={toast.id} 
                        className="flex flex-col items-end"
                    >
                        <Toast toast={toast} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;