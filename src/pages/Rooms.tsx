import { useEffect, useState, useMemo, useCallback } from 'react';
import { Home, TrendingUp, Star } from 'lucide-react'; 

import type { Room } from '../types'; 
import mockRooms from '../data/mockRooms.json';
import FilterSidebar from '../components/Rooms/FilterSidebar'; 
import RoomCard from '../components/Rooms/RoomCard'; 
import Footer from '../components/Dashboard/Footer';


// 1. FIXED: Update capacity to number[] for multi-select
interface FilterState {
  roomTypes: string[];
  capacity: number[]; // Change from number | null to number[]
  priceRange: [number, number];
  minRating: number | null;
}

const initialFilterState: FilterState = {
  roomTypes: [],
  // 2. FIXED: Initialize capacity as an empty array
  capacity: [], 
  priceRange: [0, 500], 
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
      await new Promise(resolve => setTimeout(resolve, 500)); 

      // NOTE: Ensure mockRooms.json matches your Room type structure
      const mockResponse = { data: { rooms: mockRooms } }; 
      setRooms(mockResponse.data.rooms || []);
      
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


  // New filtering logic using the combined state
  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const { roomTypes, capacity, priceRange, minRating } = filters;
      
      // Price Range Filter
      if (room.pricePerNight < priceRange[0] || room.pricePerNight > priceRange[1]) return false;
      
      // Room Type Filter (Multi-select: Room type must be included in the selected types)
      if (roomTypes.length > 0 && !roomTypes.includes(room.type)) return false;
      
      // 3. FIXED: Capacity Filter (Multi-select: Room's maxPeople must be an EXACT match for ANY selected capacity)
      if (capacity.length > 0 && !capacity.includes(room.maxPeople)) return false;
      
      // Minimum Rating Filter
      if (minRating !== null && (room.rating || 0) < minRating) return false;
      
      return true;
    });
  }, [rooms, filters]);

  // Derive stats for the integrated header section
  const totalRooms = rooms.length;
  const availableRooms = rooms.filter(r => r.isAvailable).length;
  const avgRating = totalRooms > 0 
    ? (rooms.reduce((sum, r) => sum + (r.rating || 0), 0) / totalRooms).toFixed(1)
    : 'N/A';
  
  // Check if any filter is active (Capacity check is now for an empty array)
  const isFilterActive = JSON.stringify(filters) !== JSON.stringify(initialFilterState);
  
  const clearFilters = () => setFilters(initialFilterState);
  
  const updateFilters = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  if (loading) {
    // ... (loading component) ...
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

  // Helper component for the individual stat cards (remains the same)
  const StatCard = ({ icon: Icon, title, value, variant }: { icon: React.ElementType, title: string, value: string | number, variant: 'gold' | 'navy' }) => {
    // Determine icon and background classes based on variant
    const iconColorClass = variant === 'gold' ? 'text-[#d4a574]' : 'text-[#0a1e3d]';
    const bgColorClass = variant === 'gold' ? 'bg-[#d4a574]/10' : 'bg-[#0a1e3d]/10';
    
    // Icon for average rating stat
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
      
      {/* 1. Header and Stats Section (Integrated) */}
      <div className="bg-gradient-to-b from-[#f8f9fa] to-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-12">
          
          {/* Page Title & Subtitle */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl text-[#0a1e3d] mb-3 font-medium">
              Available Rooms & Suites
            </h1>
            <p className="text-gray-600 text-lg">
              Discover luxury accommodations crafted for your comfort and style
            </p>
          </div>

          {/* Stats Cards Grid */}
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
      
      {/* 2. Main Content Wrapper */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl text-[#0a1e3d] font-medium">
                {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Found
            </h2>
            
            {/* Mobile Filter Toggle Button */}
            <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden px-4 py-2 rounded-xl border-2 border-[#0a1e3d] text-[#0a1e3d] hover:bg-[#0a1e3d] hover:text-white transition-colors font-medium"
            >
                <Home className="h-4 w-4 mr-2 inline-block" /> 
                Filters {isFilterActive && <span className="ml-2 bg-[#d4a574] text-[#0a1e3d] rounded-full px-2 py-0.5 text-xs font-semibold">!</span>}
            </button>
        </div>

        {/* 3. Filter Sidebar + Room List Grid */}
        {/* FIX APPLIED: Added lg:items-start for sticky sidebar stop point */}
        <div className="lg:grid lg:grid-cols-4 lg:gap-8 **lg:items-start**"> 
          
          {/* Column 1: Filter Sidebar (1/4 width on large screens) */}
          <FilterSidebar
            className="lg:col-span-1"
            filters={filters}
            updateFilters={updateFilters}
            clearFilters={clearFilters}
            isFilterActive={isFilterActive}
            showFilters={showFilters} 
            setShowFilters={setShowFilters}
          />

          {/* Column 2: Room List (3/4 width on large screens) */}
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
            
            {/* Render the new horizontal RoomCard component */}
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
      {/* 4. Footer Component */}
      <Footer />
    </div>
  );
}

export default Rooms;