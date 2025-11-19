import React from 'react';
import { X } from 'lucide-react';

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
}) => {
    if (!isOpen) return null;

    // Use a stopPropagation wrapper to prevent clicks on the modal content 
    // from triggering the backdrop click handler
    const handleContentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        // Backdrop
        <div 
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-300"
            onClick={onClose} // Close on backdrop click
        >
            {/* Modal Content */}
            <div 
                className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 transform transition-all duration-300 scale-100"
                onClick={handleContentClick}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Body */}
                <div className="p-5">
                    <p className="text-gray-600">
                        {message}
                    </p>
                </div>
                
                {/* Footer / Actions */}
                <div className="flex justify-end p-5 space-x-3 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;