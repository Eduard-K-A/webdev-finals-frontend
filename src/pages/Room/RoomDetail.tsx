import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import type { Room as RoomType } from '../../types';

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState(0); // Track current photo in carousel

  useEffect(() => {
  if (!id) return;

  const fetchRoom = async () => {
    setLoading(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      console.log('Fetching room with ID:', id);
      console.log('API URL:', `${apiBaseUrl}/api/rooms/${id}`);
      
      const res = await axios.get(`${apiBaseUrl}/api/rooms/${id}`);
      console.log('API Response:', res.data);
      
      // API returns { room: {...} }, extract it
      const roomData = res.data.room || res.data;
      setRoom(roomData);
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  fetchRoom();
}, [id]);

  // Carousel navigation function
  const handleNextPhoto = () => {
    if (!room || !room.photos) return;
    setCurrentPhoto((prev) => (prev + 1) % room.photos.length); // Wrap around
  };

  const handlePrevPhoto = () => {
    if (!room || !room.photos) return;
    setCurrentPhoto((prev) => (prev - 1 + room.photos.length) % room.photos.length); // Ensure positive index
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
        Loading...
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-2">Error!</h2>
        <p className="text-gray-500 text-lg">{error || 'Room not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 space-y-10">
      {/* Photo Carousel */}
      {room.photos && room.photos.length > 0 && (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-shadow duration-500">
          <img
            src={room.photos[currentPhoto].url}
            alt={room.title}
            className="w-full h-96 md:h-[500px] object-cover transform hover:scale-105 transition duration-500"
          />
          {room.photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
              >
                &#10094;
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
              >
                &#10095;
              </button>
            </>
          )}
        </div>
      )}

      {/* Room Details */}
      <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-6 hover:shadow-2xl transition-shadow duration-500">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-brand-navy)] tracking-tight">
          {room.title}
        </h1>

        {/* Description */}
        <p className="text-gray-700 text-lg md:text-xl mt-4">{room.description}</p>

        {/* Amenities */}
        {room.amenities && room.amenities.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Amenities</h2>
            <ul className="flex flex-wrap gap-3">
              {room.amenities.map((amenity, idx) => (
                <li
                  key={idx}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm md:text-base"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Room Info */}
        <div className="mt-6 flex flex-wrap gap-6 text-gray-800 text-lg md:text-xl">
          <p>
            <span className="font-semibold">Type:</span> {room.type}
          </p>
          <p>
            <span className="font-semibold">Max Guests:</span> {room.maxPeople}
          </p>
          <p>
            <span className="font-semibold">Price:</span>{' '}
            <span className="text-2xl md:text-3xl font-bold text-blue-600">
              ${room.pricePerNight}
            </span>{' '}
            <span className="text-gray-500 ml-1">/ night</span>
          </p>
        </div>

        {/* Book button */}
        <button className="mt-6 w-full md:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl text-lg md:text-xl shadow-lg hover:shadow-2xl transition-all duration-300">
          Book Now
        </button>
      </div>
    </div>
  );
};

export default RoomDetail;
