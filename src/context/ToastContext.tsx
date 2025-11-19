// src/context/ToastContext.tsx

import React, { 
    createContext, 
    useState, 
    useContext, 
    type ReactNode, 
    useCallback 
} from 'react';

// Define the shape of a single toast
export interface ToastMessage {
    id: number;
    title: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

// Define the shape of the context values
interface ToastContextType {
    toasts: ToastMessage[];
    addToast: (title: string, message: string, type: ToastMessage['type']) => void;
    // 1. ADD removeToast to the public interface
    removeToast: (id: number) => void; 
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Default TTL (Time-to-Live) for toasts in milliseconds (e.g., 5 seconds)
const TOAST_TTL = 5000;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
    }, []);

    const addToast = useCallback(
        (title: string, message: string, type: ToastMessage['type']) => {
            const id = Date.now();
            const newToast: ToastMessage = { id, title, message, type };
            
            // Add new toast to the list
            setToasts((prevToasts) => [...prevToasts, newToast]);

            // Set a timeout to remove the toast after TOAST_TTL
            setTimeout(() => {
                removeToast(id);
            }, TOAST_TTL);
        },
        [removeToast]
    );

    return (
        // 2. PASS removeToast in the context value
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}> 
            {children}
        </ToastContext.Provider>
    );
};

// Custom hook to use the toast functionality
export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};