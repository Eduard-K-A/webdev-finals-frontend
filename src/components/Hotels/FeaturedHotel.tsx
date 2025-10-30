import React from "react";
import { Link } from "react-router-dom";
import { Star } from 'lucide-react'; 
import hotels from "../../data/hotels.json"; 
import type { FeaturedHotel } from "../../types"; 

const MockImage: React.FC<{ src: string, alt: string, className: string }> = ({ alt, className }) => {

    return <div className={`h-full w-full bg-gray-300 flex items-center justify-center text-sm text-gray-700 ${className}`}>
        {alt || 'Hotel Image Placeholder'}
    </div>;
};

interface FeaturedHotelsProps {}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = () => {
    const hotelsList = (hotels as FeaturedHotel[]).slice(0, 3);
    
    const getMockRating = (id: number) => ({
        rating: 4.5 + (id % 4) / 10,
        reviewCount: 100 + (id * 50),
    });

    const handleViewAllRooms = () => {
        console.log("Navigating to all rooms page");
    };

    return (

        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl text-[#0a1e3d] mb-4 font-semibold">
                        Popular Reservation
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our handpicked selection of luxurious accommodations designed for your comfort
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {hotelsList.map((hotel) => {
                        const { rating, reviewCount } = getMockRating(hotel.id);
                        
                        return (
                            <Link
                                key={hotel.id}
                                to={`/Hotels/${hotel.id}`} 
                                className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group block"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <MockImage
                                        src={hotel.image || ''}
                                        alt={hotel.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    
                                    <div className="absolute top-4 right-4 bg-[#d4a574] text-[#0a1e3d] text-sm px-3 py-1 rounded-full font-semibold">
                                        ${hotel.price}/night
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-xl text-[#0a1e3d] mb-2 font-semibold">
                                        {hotel.name}
                                    </h3>

                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-[#d4a574] fill-[#d4a574]" />
                                            <span className="ml-1 text-[#0a1e3d] font-medium">{rating.toFixed(1)}</span>
                                        </div>
                                        
                                        <span className="text-gray-500">
                                            ({reviewCount} reviews)
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-6 line-clamp-2 text-base">
                                        {hotel.city}: Experience luxury in this elegant room, featuring modern amenities and stunning views, perfect for a restful escape.
                                    </p>
                                    
                                    <div
                                        className="w-full text-center py-3 bg-[#0a1e3d] hover:bg-[#0a1e3d]/90 text-white rounded-xl text-base font-semibold transition-colors"
                                    >
                                        View Details
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <button
                        onClick={handleViewAllRooms}
                        className="py-3 px-8 text-base font-semibold rounded-full border-2 border-[#d4a574] text-[#0a1e3d] hover:bg-[#d4a574] hover:text-white transition-all duration-200"
                    >
                        View All Rooms
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedHotels;