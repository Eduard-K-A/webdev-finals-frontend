import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";
import { Hotel, Calendar, Clock, MapPin, Loader2 } from "lucide-react";
import type { Booking } from "../../types";
import { fetchWithCache } from "../../utils/cache";

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  //navigate to home if no token
  if (!token) {
    return <Navigate to="/Signin" replace />;
  }
  // Fetch all bookings for logged-in user
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const apiBaseUrl =
          import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

        // Debug: Check if token exists
        console.log("Auth Token:", token ? "✓ Present" : "✗ Missing");
        if (!token) {
          setError("Please log in to view your bookings.");
          setLoading(false);
          return;
        }

        const headers: any = { 'Authorization': `Bearer ${token}` };
        console.log("Fetching from:", `${apiBaseUrl}/api/bookings`);

        // Fetch with cache
        const bookingData = await fetchWithCache(
          'user_bookings',
          async () => {
            const res = await axios.get(`${apiBaseUrl}/api/bookings`, { headers });
            console.log("Bookings response:", res.data);
            return Array.isArray(res.data) ? res.data : (res.data.bookings || res.data);
          },
          3 * 60 * 1000 // 3 minute TTL for bookings
        );

        if (!bookingData || bookingData.length === 0) {
          setBookings([]);
          setError("No bookings found. Start planning your next stay!");
        } else {
          console.log("Bookings loaded:", bookingData.length);
          setBookings(bookingData);
        }
      } catch (err: any) {
        console.error("Error fetching bookings:", err);
        console.error("Response data:", err.response?.data);
        console.error("Response status:", err.response?.status);
        setBookings([]);

        // Better error messages
        if (err.response?.status === 401) {
          setError("Authentication failed. Please log in again.");
        } else {
          setError(
            err.response?.data?.error || err.message || "Failed to load bookings"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();

    // Listen for booking updates
    const handleBookingUpdate = () => fetchBookings();
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    return () => window.removeEventListener('bookingUpdated', handleBookingUpdate);
  }, [token]);

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
        <p className="text-lg">{error || "No Bookings found."}</p>
      </div>
    );
  }

  // Render list of bookings
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 pt-28">
      <h1 className="text-3xl font-bold text-[#362f22] mb-6">My Bookings</h1>

      <div className="w-full max-w-3xl space-y-6">
        {bookings.filter(b => b.room).map((b) => (
          <div
            key={b._id || b.id}
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
                    <Calendar className="w-5 h-5" /> Check-in:{" "}
                    <span className="font-medium">{new Date(b.checkInDate).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Check-out:{" "}
                    <span className="font-medium">{new Date(b.checkOutDate).toLocaleDateString()}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Room Type:{" "}
                    <span className="font-medium">{b.room.type}</span>
                  </p>
                  <p className="text-sm mt-2">
                    Status: <span className={`font-medium ${b.status === 'Confirmed' ? 'text-green-600' : b.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{b.status}</span>
                  </p>
                </div>
              </div>

              {/* View Details button */}
              <div className="mt-6 md:mt-0">
                <Link
                  to={`/Hotels/${b.room.id}`} // link to RoomDetail page
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