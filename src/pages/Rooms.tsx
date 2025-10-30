import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Photo, Room } from '../types';

function Rooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'available' | 'unavailable'>('all');

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await axios.get(`${apiBaseUrl}/api/rooms`);
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Failed to fetch rooms', err);
      setError('Failed to load rooms. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
  }, []);

  const filteredRooms = rooms.filter(room => {
    if (filter === 'available') return room.isAvailable;
    if (filter === 'unavailable') return !room.isAvailable;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading rooms...</p>
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

  return (
    <div className="p-4">
      {/* Filter Controls */}
      <div className="mb-6 flex items-center gap-2">
        <span className="text-gray-700 font-medium">Filter:</span>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({rooms.length})
        </button>
        <button
          onClick={() => setFilter('available')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'available'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Available ({rooms.filter(r => r.isAvailable).length})
        </button>
        <button
          onClick={() => setFilter('unavailable')}
          className={`px-4 py-2 rounded transition-colors ${
            filter === 'unavailable'
              ? 'bg-gray-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unavailable ({rooms.filter(r => !r.isAvailable).length})
        </button>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {filter === 'all' 
                ? 'No rooms available yet' 
                : `No ${filter} rooms found`}
            </p>
          </div>
        )}
        
        {filteredRooms.map(room => (
          <div
            key={room._id}
            className={`border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow ${
              !room.isAvailable ? 'opacity-75' : ''
            }`}
          >
            {/* Room Image */}
            <div className="relative">
              {room.photos && room.photos[0] ? (
                <img
                  src={room.photos[0].url}
                  alt={room.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23e5e7eb" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" fill="%239ca3af" font-size="16" dy=".3em"%3EImage not available%3C/text%3E%3C/svg%3E';
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
              
              {/* Availability Badge */}
              <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-sm font-semibold ${
                room.isAvailable 
                  ? 'bg-green-500 text-white' 
                  : 'bg-gray-500 text-white'
              }`}>
                {room.isAvailable ? 'Available' : 'Unavailable'}
              </div>
            </div>

            {/* Room Details */}
            <div className="p-4">
              <h3 className="font-semibold text-xl mb-2 text-gray-800">
                {room.title}
              </h3>
              
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {room.type}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Up to {room.maxPeople} {room.maxPeople === 1 ? 'guest' : 'guests'}
                </span>
              </div>
              
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {room.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="font-bold text-2xl text-blue-600">
                  ${room.pricePerNight}
                  <span className="text-sm text-gray-600 font-normal"> / night</span>
                </div>
                
                <button
                  disabled={!room.isAvailable}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    room.isAvailable
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.isAvailable ? 'View Details' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Rooms;