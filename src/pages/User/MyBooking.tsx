import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Hotel, Calendar, Clock, MapPin, Loader2 } from 'lucide-react';
import type {  Booking } from '../../types';


const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all bookings for logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
        const res = await axios.get(`${apiBaseUrl}/api/bookings`); // adjust endpoint if needed

        // Some APIs may wrap bookings in a key like "bookings"
        const bookingData = res.data.bookings || res.data;

        if (!bookingData || bookingData.length === 0) {
          setBookings([]);
          setError('No Bookings found.');
        } else {
          setBookings(bookingData);
        }
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setBookings([]);
        setError(err.response?.data?.message || err.message || 'No Bookings found.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
        <Loader2 className="animate-spin w-10 h-10 mr-2" />
        Loading your bookings...
      </div>
    );
  }

  // No bookings / error state
  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center text-[#362f22]/70">
        <Hotel className="w-12 h-12 mx-auto mb-4 opacity-70" />
        <p className="text-lg">{error || 'No Bookings found.'}</p>
      </div>
    );
  }

  // Render list of bookings
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 pt-28">
      <h1 className="text-3xl font-bold text-[#362f22] mb-6">My Bookings</h1>

      <div className="w-full max-w-3xl space-y-6">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="shadow-lg rounded-2xl border border-[#e1d7c6] bg-[#faf7f2] hover:shadow-xl transition-all duration-300 p-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                {/* Room Title */}
                <h2 className="text-2xl font-semibold text-[#362f22] flex items-center gap-2">
                  <Hotel className="w-6 h-6" /> {b.room.title}
                </h2>

                {/* Booking Info */}
                <div className="mt-3 space-y-2 text-[#362f22]/80">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Check-in: <span className="font-medium">{b.checkIn}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Check-out: <span className="font-medium">{b.checkOut}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Location: <span className="font-medium">{b.location}</span>
                  </p>
                </div>
              </div>

              {/* View Details button */}
              <div className="mt-6 md:mt-0">
                <Link
                  to={`/rooms/${b.room.id}`} // link to RoomDetail page
                  className="bg-[#d4a574] hover:bg-[#c9965c] text-white px-6 py-2 rounded-xl shadow-md inline-block"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;
