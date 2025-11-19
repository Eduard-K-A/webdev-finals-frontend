import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from 'lucide-react'; 
import type { Room } from "../../types";
import { fetchWithCache } from "../../utils/cache";

interface FeaturedHotelsProps {}

const FeaturedHotels: React.FC<FeaturedHotelsProps> = () => {
    const [hotelsList, setHotelsList] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const roomsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        const fetchHotels = async () => {
            setLoading(true);
            setError(null);
            try {
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                
                const list = await fetchWithCache(
                    'featured_hotels',
                    async () => {
                        const res = await fetch(`${API_BASE_URL}/api/rooms?available=true`, { signal: controller.signal });
                        if (!res.ok) throw new Error(`HTTP ${res.status}`);
                        const data = await res.json();

                        // Map rooms and keep minimal info for featured display
                        return (data.rooms || []).slice(0, 3).map((room: any) => ({
                            _id: room._id,
                            title: room.title || 'Room',
                            city: room.city || '',
                            pricePerNight: room.pricePerNight || 0,
                            thumbnailPic: room.thumbnailPic || room.photos?.[0] || null,
                            rating: room.rating ?? null,           // Nullable number
                            reviewCount: room.reviewCount ?? null, // Nullable number
                        }));
                    },
                    5 * 60 * 1000 // 5-minute cache TTL
                );

                setHotelsList(list);
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error('Failed to load featured rooms', err);
                setError(err.message || 'Failed to fetch featured rooms');
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
        return () => controller.abort();
    }, []);

    // Auto-pagination
    const paginatedHotels = useMemo(() => {
        const startIndex = (currentPage - 1) * roomsPerPage;
        return hotelsList.slice(startIndex, startIndex + roomsPerPage);
    }, [currentPage, hotelsList]);

    const totalPages = Math.ceil(hotelsList.length / roomsPerPage);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev % totalPages) + 1);
        }, 5000); // Auto-scroll every 5 seconds

        return () => clearInterval(interval);
    }, [totalPages]);

    const handleViewAllRooms = () => {
        console.log("Navigating to all rooms page");
    };

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl text-[#0a1e3d] mb-4 font-semibold">
                        Featured Rooms
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Discover our handpicked selection of luxurious accommodations designed for your comfort
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-3 text-center text-gray-500">Loading...</div>
                    ) : error ? (
                        <div className="col-span-3 text-center text-red-500">{error}</div>
                    ) : paginatedHotels.map((hotel) => {
                        // Rating may be null
                        const rating: number | null = hotel.rating ?? null;
                        const reviewCount: number | null = hotel.reviewCount ?? null;

                        return (
                            <div
                                key={hotel._id}
                                className="bg-white overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer group block"
                            >
                                {/* Image */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={hotel.thumbnailPic?.url || ''}
                                        alt={hotel.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute top-4 right-4 bg-[#d4a574] text-[#0a1e3d] text-sm px-3 py-1 rounded-full font-semibold">
                                        ${hotel.pricePerNight}/night
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6">
                                    <h3 className="text-xl text-[#0a1e3d] mb-2 font-semibold">
                                        {hotel.title}
                                    </h3>
                                    
                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-3 text-sm">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-[#d4a574] fill-[#d4a574]" />
                                            <span className="ml-1 text-[#0a1e3d] font-medium">
                                                {rating === null ? "N/A" : rating.toFixed(1)}
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            ({reviewCount ?? 0} reviews)
                                        </span>
                                    </div>
                                    {/* Description */}
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">About this room</h4>
                                        <p className="text-gray-600 line-clamp-2 text-base">
                                            {hotel.description || 'Experience luxury in this elegant room, featuring modern amenities and stunning views, perfect for a restful escape.'}
                                        </p>
                                    </div>
                                    {/* View Details Button */}
                                    <div
                                        className="w-full text-center py-3 bg-[#0a1e3d] hover:bg-[#0a1e3d]/90 text-white rounded-xl text-base font-semibold transition-colors"
                                        onClick={() => navigate(`/Hotels/${hotel._id}`)}
                                        role="button"
                                        tabIndex={0}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        View Details
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <Link
                        to="/Rooms"
                        onClick={handleViewAllRooms}
                        className="py-3 px-8 text-base font-semibold rounded-full border-2 border-[#d4a574] text-[#0a1e3d] hover:bg-[#d4a574] hover:text-white transition-all duration-200"
                    >
                        View All Rooms
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedHotels;
