// src/pages/User/MyBooking.tsx (Updated)

import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Hotel, Loader2, Calendar, Users, X } from "lucide-react"; 
import type { Booking } from "../../types";
import { fetchWithCache, clearCacheKey } from "../../utils/cache"; 
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
// ADDED: Import the new modal component
import ConfirmationModal from "../../components/Modals/ConfirmationModal"; 

// Helper function to format date to MM/DD/YYYY
const formatDate = (dateString: string | Date) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Status Styling Helper Function
const getStatusClasses = (status: Booking['status']): string => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
    case 'Confirmed':
      return 'bg-green-50 text-green-700 ring-green-600/20';
    case 'Cancelled':
      return 'bg-red-50 text-red-700 ring-red-600/20';
    case 'Completed':
      return 'bg-gray-50 text-gray-700 ring-gray-600/20';
    default:
      return 'bg-yellow-50 text-yellow-700 ring-yellow-600/20';
  }
};

// --- MyBookings Component ---
const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // ADDED: State for managing the Confirmation Modal
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancelId, setBookingToCancelId] = useState<string | null>(null);

  const { isLoggedIn } = useAuth();
  const { addToast } = useToast(); 

  const token = localStorage.getItem("token");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const headers: any = { 'Authorization': `Bearer ${token}` };

  // Check if auth is still loading
  const isAuthenticating = token && !isLoggedIn;

  // Fetch all bookings for logged-in user
  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
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
        3 * 60 * 1000 // 3 minute TTL
      );

      if (!bookingData || bookingData.length === 0) {
        setBookings([]);
        setError("No bookings found. Start planning your next stay!");
      } else {
        setBookings(bookingData);
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      setError(
        err.response?.data?.message || 
        err.message || 
        "Failed to load bookings. Please try again later."
      );
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

  // --- Handlers for Cancel ---
  // MODIFIED: This is now the final confirmation step triggered by the modal
  const handleConfirmCancel = async () => {
    if (!bookingToCancelId) return;

    setIsCancelModalOpen(false); // Close modal right away
    const bookingId = bookingToCancelId;
    setBookingToCancelId(null);

    try {
      setLoading(true);

      await axios.put(
        `${apiBaseUrl}/api/bookings/${bookingId}/cancel`, 
        { status: 'Cancelled' }, 
        { headers }
      );
      
      // OPTIMIZATION (Fix slow loading): Clear cache and update local state
      clearCacheKey('user_bookings'); 
      setBookings(prevBookings => prevBookings.map(b => 
        (b._id === bookingId || b.id === bookingId) 
          ? { ...b, status: 'Cancelled' } 
          : b
      ));

      setLoading(false); // Stop loading immediately after local update

      // ADDED: Toast notification for success
      addToast('Success', `Booking #${bookingId.substring(0, 8)}... successfully cancelled.`, 'success');

    } catch (err: any) {
      setLoading(false);
      console.error("Error cancelling booking:", err);
      // ADDED: Toast notification for error
      addToast('Error', `Failed to cancel booking: ${err.response?.data?.message || err.message}`, 'error');
    }
  };

  // NEW: Handler to open the modal, replacing window.confirm
  const handleOpenCancelModal = (bookingId: string) => {
      setBookingToCancelId(bookingId);
      setIsCancelModalOpen(true);
  };

  // Filter for 'Active Bookings' (not cancelled and check-out is in the future)
  const activeBookings = bookings.filter(b => 
    b.room && 
    b.status !== 'Cancelled' && 
    new Date(b.checkOutDate) >= new Date()
  );

  // Navigate to sign in if no token - MOVED AFTER ALL HOOKS
  if (!token && !isLoggedIn) { 
    return <Navigate to="/SignIn" replace />;
  }

  // Show loading while authenticating
  if (isAuthenticating) {
    return (
      <div className="flex items-center justify-center h-screen animate-pulse text-gray-500 text-xl">
        <Loader2 className="animate-spin w-10 h-10 mr-2" />
        Authenticating...
      </div>
    );
  }

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page Header */}
        <header className="pb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-500">Manage your hotel reservations and view booking history</p>
        </header>
        
        {/* Active Bookings Section */}
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Active Bookings</h2>

        {activeBookings.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center text-gray-500 border border-dashed rounded-lg mt-4">
            <Hotel className="w-10 h-10 mx-auto mb-4 opacity-70" />
            <p className="text-lg">{error || "No active bookings found."}</p>
          </div>
        )}
        
        {/* Booking List - Card UI */}
        <div className="space-y-6">
          {activeBookings.map((b) => {
            const room = b.room;
            const displayPrice = `₱${b.totalPrice?.toFixed(0) || '---'}`; 

            return (
              <div 
                key={b._id || b.id} 
                className="flex border rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className="w-48 h-48 flex-shrink-0">
                  <img
                    src={room.photos?.[0]?.url || 'https://via.placeholder.com/200x200?text=Room+Image'} 
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details and Actions Section */}
                <div className="flex-1 p-5 flex justify-between items-start">
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      {/* Room Title */}
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {room.title}
                      </h3>
                      
                      {/* Dynamic Status Tag */}
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
                      
                      {/* Guests */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-gray-500" />
                        <div>
                          <p className="text-xs">Guests</p>
                          <span className="font-medium">{b.totalGuests} guests</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-2xl font-bold text-gray-900 mt-2">
                      {displayPrice}
                    </div>
                  </div>

                  {/* Right-side Actions */}
                  <div className="flex flex-col items-end justify-end h-full space-y-2">
                    <div className="flex space-x-3">
                      {/* Removed Edit Button */}
                      <button
                        // MODIFIED: Calls handler to open custom modal
                        onClick={() => handleOpenCancelModal(b._id || b.id || '')} 
                        disabled={b.status === 'Cancelled' || b.status === 'Completed'}
                        className="flex items-center text-sm font-medium text-red-600 border border-red-300 rounded-lg px-4 py-2 transition-colors hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* NEW: Custom Confirmation Modal component rendered at the root of MyBookings */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel} // Calls the main cancellation logic
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
      />
    </div>
  );
};

export default MyBookings;