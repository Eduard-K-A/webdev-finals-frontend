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

    const [error, setError] = useState<string | null>(null);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (!destination || !checkIn || !checkOut) {
            setError("Please select a destination and dates.");
            return;
        }

        const today = new Date();
        today.setHours(0,0,0,0);
        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkInDate < today) {
            setError("Check-in date cannot be in the past.");
            return;
        }
        if (checkOutDate <= checkInDate) {
            setError("Check-out date must be after check-in date.");
            return;
        }

        // 1. Update Global State with Date objects
        updateSearchParams({ 
            destination, 
            checkInDate, 
            checkOutDate, 
            options 
        });
        navigate('/hotels/search'); 
    };

    return (
        <form
        className="flex flex-col md:flex-row items-center justify-center p-4 bg-white rounded-lg shadow-xl -mt-10 mx-auto w-11/12 max-w-5xl space-y-3 md:space-y-0 md:space-x-3 opacity-0 animate-slide-up-fade-in"
        style={{ animationDelay: "0.3s" }}
        onSubmit={handleSearch}
        >
            {/* Error Message */}
            {error && (
                <div className="w-full mb-2 text-center text-red-600 bg-red-100 border border-red-200 rounded p-2">
                    {error}
                </div>
            )}
            {/* destination Input */}
            <div className="flex-1 w-full md:w-auto">
                <input 
                    type="text" 
                    style={{ color: 'gray' }}
                    placeholder="Where are you going?" 
                    className="p-3 w-full border border-black-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDestination(e.target.value)}
                    required
                />
            </div>

            {/* Date Inputs */}
            <div className="flex space-x-2 w-full md:w-auto md:flex-initial">
                <input 
                    type="date" 
                    style={{ color: 'gray' }}
                    className="p-3 w-1/2 border border-black-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckIn(e.target.value)}
                    required
                />
                <input 
                    type="date" 
                    style={{ color: 'gray' }}
                    className="p-3 w-1/2 border border-black-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCheckOut(e.target.value)}
                    required
                />
            </div>

            {/* Options Dropdown */}
            <div className="w-full md:w-auto md:flex-initial">
                <select 
                    className="p-3 w-full border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                   style={{ color: 'gray' }}
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
                className="w-full md:w-auto bg-[#d4a574] text-white font-semibold py-3 px-6 rounded hover:bg-[#b48c5a] transition duration-300"
            >
                Search
            </button>
        </form>
    );
};
export default SearchForm;