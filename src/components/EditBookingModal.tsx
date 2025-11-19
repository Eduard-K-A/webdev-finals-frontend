import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import type { Booking } from "../types";

interface EditBookingModalProps {
  booking: Booking;
  onClose: () => void;
  onSave: (updatedBookingData: Partial<Booking>) => Promise<void>;
}

// Converts date string to YYYY-MM-DD format for input[type="date"]
const formatDateToInput = (dateString: string | Date) => {
    if (!dateString) return '';
    // Ensure it's a Date object before calling toISOString
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toISOString().split('T')[0];
};

const EditBookingModal: React.FC<EditBookingModalProps> = ({ booking, onClose, onSave }) => {
  // CORRECTED: Using totalGuests based on your types.ts 
  const [checkInDate, setCheckInDate] = useState(formatDateToInput(booking.checkInDate));
  const [checkOutDate, setCheckOutDate] = useState(formatDateToInput(booking.checkOutDate));
  const [totalGuests, setTotalGuests] = useState(booking.totalGuests || 1); // 
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Use room.maxPeople  as the max guest limit
  const maxGuests = booking.room?.maxPeople || 6; 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend date validation
    const today = new Date();
    today.setHours(0,0,0,0);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn < today) {
      setError("Check-in date cannot be in the past.");
      return;
    }
    if (checkOut <= checkIn) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    setIsSaving(true);
    const updatedData: Partial<Booking> = {
      _id: booking._id,
      checkInDate: new Date(checkInDate).toISOString(),
      checkOutDate: new Date(checkOutDate).toISOString(),
      totalGuests: Number(totalGuests), // 
    };

    try {
      await onSave(updatedData);
      // onSave handles closing the modal and re-fetching data on success
    } catch (error) {
      // Error handled in MyBookings.tsx, but stop spinner here
      console.error("Error saving booking changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 flex justify-center items-center p-4">
      {/* Modal Container */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        
        {/* Modal Header */}
        <header className="p-6">
          <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Modal Body (Form) */}
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="w-full mb-2 text-center text-red-600 bg-red-100 border border-red-200 rounded p-2">
              {error}
            </div>
          )}
          {/* Check-in Date */}
          <div>
            <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700 mb-2">
              Check-in Date
            </label>
            <input
              type="date"
              id="checkIn"
              name="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
            />
          </div>

          {/* Check-out Date */}
          <div>
            <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700 mb-2">
              Check-out Date
            </label>
            <input
              type="date"
              id="checkOut"
              name="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
              min={checkInDate} // Enforce logical dates
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 appearance-none"
            />
          </div>

          {/* Number of Guests */}
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Guests
            </label>
            <input
              type="number"
              id="guests"
              name="totalGuests" // 
              value={totalGuests}
              onChange={(e) => setTotalGuests(Number(e.target.value))}
              min="1"
              max={maxGuests} 
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Modal Footer (Actions) */}
          <div className="flex justify-end pt-4 space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-6 py-2 text-gray-700 bg-white rounded-lg hover:bg-gray-50 transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center px-6 py-2 text-white bg-[#d4a574] rounded-lg hover:bg-[#c9965c] transition-colors shadow-md disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookingModal;