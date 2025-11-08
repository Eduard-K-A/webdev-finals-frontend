// src/context/SearchContext.tsx
import React, { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';
import type { SearchState, SearchContextType } from '../types.ts';

// Initial state, strongly typed
const INITIAL_STATE: SearchState = {
    destination: undefined,
    checkInDate: undefined,
    checkOutDate: undefined,
    options: {
        adults: 1,
        children: 0,
        rooms: 1,
    }
};//

// Create Context with the defined type and a default mock value
const SearchContext = createContext<SearchContextType | undefined>(undefined);

interface SearchContextProviderProps {
    children: ReactNode;
}

// Provider Component
export const SearchContextProvider: React.FC<SearchContextProviderProps> = ({ children }) => {
    const [searchParams, setSearchParams] = useState<SearchState>(INITIAL_STATE);
    
    // Use Partial<SearchState> to allow updating only a subset of properties
    const updateSearchParams = (params: Partial<SearchState>) => {
        setSearchParams(prev => ({
            ...prev,
            ...params,
        }));
    };

    const resetSearch = () => {
        setSearchParams(INITIAL_STATE);
    };

    return (
        <SearchContext.Provider 
            value={{
                searchParams,
                updateSearchParams,
                resetSearch,
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

// Custom hook for easy consumption and type assertion
export const useSearchContext = (): SearchContextType => {
    const context = useContext(SearchContext);
    if (context === undefined) {
        throw new Error('useSearchContext must be used within a SearchContextProvider');
    }
    return context;
};