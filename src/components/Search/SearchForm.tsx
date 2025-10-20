// src/components/SearchForm/SearchForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import  { useSearchContext } from '../../context/SearchContext';
import type { SearchOptions } from '../../types.ts';

const SearchForm: React.FC = () => {
    const navigate = useNavigate();
    const { updateSearchParams } = useSearchContext() as ReturnType<typeof useSearchContext>;

    // Local state
    const [destination, setDestination] = useState<string>('');
    const [checkIn, setCheckIn] = useState<string>('');
    const [checkOut, setCheckOut] = useState<string>('');
    const [options, setOptions] = useState<SearchOptions>({ adults: 1, children: 0, rooms: 1 });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (!destination || !checkIn || !checkOut) {
            alert("Please select a destination and dates.");
            return;
        }

        // 1. Update Global State with Date objects
        updateSearchParams({ 
            destination, 
            checkInDate: new Date(checkIn), 
            checkOutDate: new Date(checkOut), 
            options 
        });

        // 2. Navigate to the search results page
        navigate('/hotels/search'); 
    };

    return (
        <form 
            className="flex flex-col md:flex-row items-center justify-center p-4 bg-white rounded-lg shadow-xl -mt-10 mx-auto w-11/12 max-w-5xl space-y-3 md:space-y-0 md:space-x-3" 
            onSubmit={handleSearch}
        >
            {/* destination Input */}
            <div className="flex-1 w-full md:w-auto">
                <input 
                    type="text" 
                    placeholder="Where are you going?" 
                    className="p-3 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                    required
                />
            </div>

            {/* Date Inputs */}
            <div className="flex space-x-2 w-full md:w-auto md:flex-initial">
                <input 
                    type="date" 
                    className="p-3 w-1/2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value)}
                    required
                />
                <input 
                    type="date" 
                    className="p-3 w-1/2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckOut(e.target.value)}
                    required
                />
            </div>

            {/* Options Dropdown */}
            <div className="w-full md:w-auto md:flex-initial">
                <select 
                    className="p-3 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    value={options.adults} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setOptions({...options, adults: parseInt(e.target.value) as SearchOptions["adults"]})}
                >
                    <option value={1}>1 Adult, {options.rooms} Room</option>
                    <option value={2}>2 Adults, {options.rooms} Rooms</option>
                    {/* ... more options */}
                </select>
            </div>

            {/* Search Button */}
            <button 
                type="submit" 
                className="w-full md:w-auto bg-blue-600 text-white font-semibold py-3 px-6 rounded hover:bg-blue-700 transition duration-300"
            >
                Search
            </button>
        </form>
    );
};

export default SearchForm;