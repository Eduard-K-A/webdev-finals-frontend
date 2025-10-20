// src/components/Featured/FeaturedHotels.tsx
import React from 'react';

// Define type for a featured item
interface FeaturedHotel {
    id: number;
    name: string;
    city: string;
    price: number;
    imagePlaceholder: string; // Using a descriptive placeholder
}

const FeaturedHotels: React.FC = () => {
    const featuredData: FeaturedHotel[] = [
        { id: 1, name: "Luxury Resort Bali", city: "Bali", price: 350, imagePlaceholder: "resort" },
        { id: 2, name: "City Loft Tokyo", city: "Tokyo", price: 180, imagePlaceholder: "city" },
        { id: 3, name: "Mountain Lodge Denver", city: "Denver", price: 220, imagePlaceholder: "mountain" },
    ];

    return (
        <section className="mt-16 mb-20 max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredData.map(hotel => (
                    <div 
                        key={hotel.id} 
                        className="bg-white rounded-lg shadow-md overflow-hidden transition transform hover:scale-[1.02] duration-300 cursor-pointer"
                    >
                        <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500 font-semibold">
                            
                        </div>
                        <div className="p-4">
                            <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                            <p className="text-gray-500 mt-1">{hotel.city}</p>
                            <span className="mt-2 inline-block text-lg font-bold text-blue-600">
                                ${hotel.price}<span className="text-sm font-normal text-gray-500">/night</span>
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FeaturedHotels;