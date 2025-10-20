// src/components/Search/SearchSidebar.tsx
import React, { useState } from 'react';
import { useSearchContext } from '../../context/SearchContext';

const SearchSidebar: React.FC = () => {
    const { searchParams, updateSearchParams } = useSearchContext();
    
    // Initialize local state from global context defaults, or 0/1000 if not set
    const [minPrice, setMinPrice] = useState<number>(searchParams.minPrice || 0);
    const [maxPrice, setMaxPrice] = useState<number>(searchParams.maxPrice || 1000);

    const handleApplyFilters = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Update the global search context with the new price filter values
        updateSearchParams({ 
            minPrice: minPrice,
            maxPrice: maxPrice
            // We are deliberately NOT updating destination or dates here
        });

        // The HotelListPage useEffect should automatically trigger a new API fetch 
        // because searchParams (in the context) has changed.
        console.log(`Filters Applied: Min $${minPrice}, Max $${maxPrice}`);
    };
    
    // Helper to format date display
    const formatDate = (date: Date | undefined): string => {
        return date ? new Date(date).toLocaleDateString() : 'N/A';
    }


    return (
        <div className="p-4 bg-yellow-500/10 rounded-lg shadow-md sticky top-4">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Refine Search</h2>
            
            {/* Current Search Details (for context) */}
            <div className="mb-6 p-3 bg-yellow-100 rounded-md text-sm text-gray-700">
                <p>📍 **Destination:** {searchParams.destination || 'N/A'}</p>
                <p>🗓️ **Dates:** {formatDate(searchParams.checkInDate)} - {formatDate(searchParams.checkOutDate)}</p>
                <p>👤 **Guests:** {searchParams.options.adults} Adults</p>
            </div>

            <form onSubmit={handleApplyFilters} className="space-y-4">
                
                {/* 1. Price Filter */}
                <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-2">Price Range</h3>
                    <div className="flex justify-between space-x-2">
                        <input
                            type="number"
                            placeholder="Min Price"
                            value={minPrice}
                            onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                            className="w-1/2 p-2 border rounded-md text-gray-700 focus:ring-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Max Price"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(parseInt(e.target.value) || 1000)}
                            className="w-1/2 p-2 border rounded-md text-gray-700 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* 2. Rating Filter (Placeholder for future implementation) */}
                <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-2">Star Rating</h3>
                    {[5, 4, 3].map(star => (
                        <div key={star} className="flex items-center mb-1">
                            <input type="checkbox" id={`star-${star}`} className="mr-2 text-blue-600 rounded" disabled />
                            <label htmlFor={`star-${star}`} className="text-gray-500">
                                {star} Stars & Up <span className='text-xs'>(Coming Soon)</span>
                            </label>
                        </div>
                    ))}
                </div>

                {/* Apply Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition duration-300"
                >
                    Apply Filters
                </button>
            </form>
        </div>
    );
};

export default SearchSidebar;