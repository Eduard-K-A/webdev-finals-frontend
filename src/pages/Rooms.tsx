import { useEffect, useState, useMemo, useCallback } from 'react';
import { Home, TrendingUp, Star } from 'lucide-react'; 

import type { Room } from '../types'; 
import FilterSidebar from '../components/Rooms/FilterSidebar'; 
import RoomCard from '../components/Rooms/RoomCard'; 
import Footer from '../components/Dashboard/Footer';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface FilterState {
  roomTypes: string[];
  capacity: number[];
  priceRange: [number, number];
  minRating: number | null;
}

const initialFilterState: FilterState = {
  roomTypes: [],
  capacity: [], 
  priceRange: [0, Infinity], 
  minRating: null,
};

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [showFilters, setShowFilters] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/rooms`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Transform backend data to match frontend Room type
      const transformedRooms: Room[] = (data.rooms || data || []).map((room: any) => ({
        _id: room._id,
        title: room.title,
        description: room.description,
        type: room.type,
        pricePerNight: room.pricePerNight,
        maxPeople: room.maxPeople,
        amenities: room.amenities || [],
        photos: room.photos || [],
        isAvailable: room.isAvailable !== undefined ? room.isAvailable : true,
        rating: room.averageRating || 0, // Map averageRating to rating
        averageRating: room.averageRating || 0,
        createdAt: room.createdAt,
        updatedAt: room.updatedAt
      }));
      
      setRooms(transformedRooms);
      
    } catch (err) {
      console.error('Failed to fetch rooms', err);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    const handler = (e: CustomEvent<Room>) => {
      const newRoom = e.detail;
      if (newRoom) {
        setRooms(prev => [newRoom, ...prev]);
      }
    };
    window.addEventListener('roomCreated', handler as EventListener);
    return () => window.removeEventListener('roomCreated', handler as EventListener);
  }, [fetchRooms]);

  // Filtering logic
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const { roomTypes, capacity, priceRange, minRating } = filters;
      
      // Price Range Filter
      if (room.pricePerNight < priceRange[0] || room.pricePerNight > priceRange[1]) return false;
      
      // Room Type Filter
      if (roomTypes.length > 0 && !roomTypes.includes(room.type)) return false;
      
      // Capacity Filter
      if (capacity.length > 0 && !capacity.includes(room.maxPeople)) return false;
      
      // Minimum Rating Filter
      if (minRating !== null && (room.rating || room.averageRating || 0) < minRating) return false;
      
      return true;
    });
  }, [rooms, filters]);

  // Derive stats
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const avgRating = totalRooms > 0 
    ? (rooms.reduce((sum, r) => sum + (r.rating || r.averageRating || 0), 0) / totalRooms).toFixed(1)
    : 'N/A';
  
  const isFilterActive = JSON.stringify(filters) !== JSON.stringify(initialFilterState);
  
  const clearFilters = () => setFilters(initialFilterState);
  
  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12 h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#d4a574] border-r-transparent"></div> 
          <p className="mt-4 text-gray-600">Loading luxury rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
     return (
        <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-800 mb-3">{error}</p>
                <button
                    onClick={fetchRooms}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        </div>
    );
  }

  const StatCard = ({ icon: Icon, title, value, variant }: { icon: React.ElementType, title: string, value: string | number, variant: 'gold' | 'navy' }) => {
    const iconColorClass = variant === 'gold' ? 'text-[#d4a574]' : 'text-[#0a1e3d]';
    const bgColorClass = variant === 'gold' ? 'bg-[#d4a574]/10' : 'bg-[#0a1e3d]/10';
    const isRating = title.includes('Rating');

    return (
      <div 
        className="bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-[#d4a574] transition-all shadow-sm hover:shadow-md cursor-default"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm mb-1">{title}</p>
            <p className="text-3xl text-[#0a1e3d] flex items-center gap-2">
              {value}
              {isRating && <Star className="h-6 w-6 text-[#d4a574] fill-[#d4a574]" />}
            </p>
          </div>
          <div className={`w-12 h-12 ${bgColorClass} rounded-full flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${iconColorClass}`} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen">
      
      {/* Header and Stats Section */}
      <div className="bg-gradient-to-b from-[#f8f9fa] to-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl text-[#0a1e3d] mb-3 font-medium">
              Available Rooms & Suites
            </h1>
            <p className="text-gray-600 text-lg">
              Discover luxury accommodations crafted for your comfort and style
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <StatCard 
              icon={Home} 
              title="Total Rooms" 
              value={totalRooms} 
              variant="gold" 
            />
            <StatCard 
              icon={TrendingUp} 
              title="Available Now" 
              value={availableRooms} 
              variant="navy" 
            />
            <StatCard 
              icon={Star} 
              title="Average Rating" 
              value={avgRating} 
              variant="gold" 
            />
          </div>
          
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-[#0a1e3d] font-medium">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Found
            </h2>
            
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 rounded-xl border-2 border-[#0a1e3d] text-[#0a1e3d] hover:bg-[#0a1e3d] hover:text-white transition-colors font-medium"
            >
                <Home className="h-4 w-4 mr-2 inline-block" /> 
                Filters {isFilterActive && <span className="ml-2 bg-[#d4a574] text-[#0a1e3d] rounded-full px-2 py-0.5 text-xs font-semibold">!</span>}
            </button>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8 lg:items-start"> 
          
          <FilterSidebar
            className="lg:col-span-1"
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            isFilterActive={isFilterActive}
            showFilters={showFilters} 
            setShowFilters={setShowFilters}
          />

          <div className="lg:col-span-3 space-y-6">
            
            {filteredRooms.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  No rooms match your current filters.
                </p>
                {isFilterActive && (
                  <button onClick={clearFilters} className="mt-4 text-[#d4a574] hover:text-[#c19563] font-medium transition-colors">
                    Clear Filters
                  </button>
                )}
              </div>
            )}
            
            {filteredRooms.map(room => (
              <RoomCard
                key={room._id}
                room={room}
                onViewDetails={() => console.log('View details for', room.title)} 
              />
            ))}
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}

export default Rooms;