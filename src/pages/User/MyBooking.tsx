import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Hotel, Loader2, Calendar, Users, Edit, X } from "lucide-react";
import type { Booking } from "../../types";
import { fetchWithCache, clearCacheKey } from "../../utils/cache"; 
import EditBookingModal from "../../components/EditBookingModal"; 
import { useAuth } from '../../context/AuthContext';

// Helper function to format date to MM/DD/YYYY (
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A';
  // Using 'en-US' locale for MM/DD/YYYY format
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }); 
};

// --- MyBookings Component ---

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);


  const { isLoggedIn } = useAuth();

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

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

  // ** NEW: Status Styling Helper Function **
  const getStatusClasses = (status: Booking['status']): string => {
    switch (status) {
      case 'Pending':
        // Yellow style for Pending
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
      case 'Confirmed':
        // Green style for Confirmed
        return 'bg-green-50 text-green-700 ring-green-600/20';
      case 'Cancelled':
        // Red style for Cancelled
        return 'bg-red-50 text-red-700 ring-red-600/20';
      case 'Completed':
        // Gray style for Completed
        return 'bg-gray-50 text-gray-700 ring-gray-600/20';
      default:
        // Default to Pending style if status is missing or unrecognized
        return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
    }
  };
  
  const fetchBookings = async () => {
    setLoading(true);
    try {
      if (!token) {
        setError("Please log in to view your bookings.");
        setLoading(false);
        return;
      }

      // Fetch with cache
      const bookingData = await fetchWithCache(
        'user_bookings',
        async () => {
          const res = await axios.get(`${apiBaseUrl}/api/bookings`, { headers });
          return Array.isArray(res.data) ? res.data : (res.data.bookings || res.data);
        },
        3 * 60 * 1000 // 3 minute TTL for bookings
      );

      if (!bookingData || bookingData.length === 0) {
        setBookings([]);
        setError("No bookings found. Start planning your next stay!");
      } else {
        setBookings(bookingData);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      // ... error handling logic remains the same ...
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const handleBookingUpdate = () => fetchBookings();
    window.addEventListener('bookingUpdated', handleBookingUpdate);
    return () => window.removeEventListener('bookingUpdated', handleBookingUpdate);
  }, [token]);

  // --- Handlers for Edit/Cancel ---
  
  const handleEdit = (booking: Booking) => {
    if (booking.room) {
      setCurrentBooking(booking);
      setIsModalOpen(true);
    } else {
      console.error("Cannot edit: Booking is missing room details.");
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) {
        return;
    }

    try {
        setLoading(true);
        // Assuming your backend supports a PUT/PATCH to set the status to 'Cancelled'
        await axios.patch(`${apiBaseUrl}/api/bookings/${bookingId}`, { status: 'Cancelled' }, { headers });
        
        // Invalidate the cache to ensure the list is refreshed
        clearCacheKey('user_bookings'); 
        
        // Re-fetch bookings
        await fetchBookings(); 
        alert("Booking cancelled successfully!"); // User feedback
    } catch (err: any) {
        setLoading(false);
        console.error("Error cancelling booking:", err);
        alert(`Failed to cancel booking: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleSaveEdit = async (updatedBookingData: Partial<Booking>) => {
    try {
        const bookingId = updatedBookingData._id;
        if (!bookingId) throw new Error("Booking ID is missing for update.");
        
        // ** API Call to Update Booking **
        await axios.put(`${apiBaseUrl}/api/bookings/${bookingId}`, updatedBookingData, { headers });
        
        // Invalidate the cache
        clearCacheKey('user_bookings'); 
        
        // Re-fetch bookings
        await fetchBookings(); 
        setIsModalOpen(false); // Close modal on success
        alert("Booking updated successfully!"); // User feedback

    } catch (error: any) {
        console.error("Error saving booking changes:", error);
        alert(`Failed to update booking: ${error.response?.data?.message || error.message}`);
        throw error; // Re-throw to handle state changes in modal (e.g., stopping the loading spinner)
    }
  };
  
  // Filter for 'Active Bookings' (not cancelled and check-out is in the future)
  const activeBookings = bookings.filter(b => 
    b.room && 
    b.status !== 'Cancelled' && 
    new Date(b.checkOutDate) >= new Date()
  );

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
        <Loader2 className="animate-spin w-10 h-10 mr-2" />
        Loading your bookings...
      </div>
    );
  }

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
                    <span className="font-medium">
                      {new Date(b.checkInDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Check-out:{" "}
                    <span className="font-medium">
                      {new Date(b.checkOutDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" /> Room Type:{" "}
                    <span className="font-medium">{b.room.type}</span>
                  </p>
                  <p className="text-sm mt-2">
                    Status: <span className={`font-medium ${b.status === 'Confirmed' ? 'text-green-600' : b.status === 'Cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>{b.status}</span>
                  </p>
                </div>

                {/* Details and Actions Section */}
                <div className="flex-1 p-5 flex justify-between items-start">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Room Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {room.title}
                      </h3>
                      
                      {/* ** UPDATED: Dynamic Status Tag ** */}
                      {b.status && (
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusClasses(b.status)}`}>
                          {b.status}
                        </span>
                      )}
                    </div>
                    
                    {/* Booking Info Grid */}
                    <div className="flex items-start space-x-8 pt-3">
                      {/* Check-in */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                            <p className="text-xs">Check-in</p>
                            <span className="font-medium">{formatDate(b.checkInDate)}</span>
                        </div>
                      </div>
                      {/* Check-out */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                            <p className="text-xs">Check-out</p>
                            <span className="font-medium">{formatDate(b.checkOutDate)}</span>
                        </div>
                      </div>
                      {/* Guests - Using totalGuests */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                            <p className="text-xs">Guests</p>
                            <span className="font-medium">{b.totalGuests} guests</span>
                        </div>
                      </div>
                    </div>

                    {/* Price (at the bottom left) */}
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      {displayPrice}
                    </div>
                  </div>

                  {/* Right-side Actions and Info */}
                  <div className="flex flex-col items-end justify-end h-full space-y-2">
                      {/* Actions */}
                      <div className="flex space-x-3">
                        <button
                            onClick={() => handleEdit(b)}
                            className="flex items-center text-sm font-medium text-orange-600 border border-orange-300 rounded-lg px-4 py-2 transition-colors hover:bg-orange-50"
                        >
                            <Edit className="w-4 h-4 mr-1" /> Edit
                        </button>
                        <button
                            onClick={() => handleCancel(b._id || b.id || '')} 
                            className="flex items-center text-sm font-medium text-red-600 border border-red-300 rounded-lg px-4 py-2 transition-colors hover:bg-red-50"
                        >
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Modal Component */}
      {isModalOpen && currentBooking && (
        <EditBookingModal
          booking={currentBooking}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default MyBookings;
