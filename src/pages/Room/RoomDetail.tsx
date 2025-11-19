import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { getCached, setCached } from '../../utils/cache';
import { useAuth } from '../../context/AuthContext';
// 1. IMPORT THE TOAST HOOK
import { useToast } from '../../context/ToastContext'; 
import {
    Users, Star, Wifi, Tv, Coffee, Check, Bed, Car, Dumbbell, Sun, Utensils,
    Calendar, Users as GuestIcon, Tag
} from 'lucide-react';
import type { Room as RoomType } from '../../types';

// Define the shape of a date range for bookings
type BookingRange = { start: string; end: string };

const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
// --- Amenity Icon Component (uses CSS variable for color) ---
const AmenityIcon = ({ name }: { name: string }) => {
    const lowerName = name.toLowerCase();
    const iconMap: { [key: string]: React.ElementType } = {
        // Basic/Common
        wifi: Wifi,
        internet: Wifi,
        tv: Tv,
        television: Tv,
        breakfast: Utensils,
        kitchen: Utensils,
        'coffee maker': Coffee,
        // Room Features
        bed: Bed,
        king: Bed,
        queen: Bed,
        single: Bed,
        double: Bed,
        // Hotel Services
        parking: Car,
        garage: Car,
        gym: Dumbbell,
        fitness: Dumbbell,
        pool: Sun,
        balcony: Sun,
        view: Sun,
    };
    
    const Icon = iconMap[lowerName] || Check;
    
    // Use the CSS Variable for the Navy color
    return <Icon className='w-5 h-5 text-[var(--color-brand-navy)]/70 shrink-0' />;
};


const RoomDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [room, setRoom] = useState<RoomType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPhoto, setCurrentPhoto] = useState(0);
    
    const [checkInDate, setCheckInDate] = useState('');
    const [checkOutDate, setCheckOutDate] = useState('');
    const [guests, setGuests] = useState(1);
    
    const [bookedRanges, setBookedRanges] = useState<BookingRange[]>([]);

    // Use the mocked useAuth()
    const { isLoggedIn } = useAuth(); 
    // 2. INITIALIZE useToast
    const { addToast } = useToast();
    const today = getTodayDate(); // Get today's date

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);


    useEffect(() => {
        if (!id) return;

        const fetchRoomAndBookings = async () => {
            setLoading(true);
            try {
                // Try cache first
                const cacheKey = `room_${id}`;
                const cachedRoom = getCached<RoomType>(cacheKey);
                if (cachedRoom && typeof cachedRoom === 'object' && 'title' in cachedRoom && 'pricePerNight' in cachedRoom) {
                    setRoom({ ...cachedRoom, isAvailable: (cachedRoom as any).isAvailable ?? true });
                } else {
                    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                    const res = await axios.get(`${apiBaseUrl}/api/rooms/${id}`);
                    const roomData = res.data.room || res.data;
                    setCached(cacheKey, roomData, 5 * 60 * 1000); // Cache for 5 minutes
                    setRoom({ ...roomData, isAvailable: roomData.isAvailable ?? true });
                }

                // Fetch bookings for this room
                const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
                const bookingsRes = await axios.get(`${apiBaseUrl}/api/bookings/all`); // admin endpoint, but you may want a /api/bookings/room/:id endpoint for public use
                const allBookings = bookingsRes.data;
                // Filter bookings for this room and not cancelled
                const roomBookings = Array.isArray(allBookings)
                    ? allBookings.filter((b) => b.room && (b.room._id === id || b.room.id === id) && b.status !== 'Cancelled')
                    : [];
                const ranges = roomBookings.map((b) => ({ start: b.checkInDate, end: b.checkOutDate }));
                setBookedRanges(ranges);
            } catch (err: any) {
                console.error('Error fetching room or bookings:', err);
                setError(err.response?.data?.message || err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchRoomAndBookings();
    }, [id]);

    // Carousel navigation functions
    const handleNextPhoto = () => {
        if (!room || !room.photos) return;
        setCurrentPhoto((prev) => (prev + 1) % room.photos.length);
    };

    const handlePrevPhoto = () => {
        if (!room || !room.photos) return;
        setCurrentPhoto((prev) => (prev - 1 + room.photos.length) % room.photos.length);
    };
    
    // --- Calculate the number of nights ---
    const calculateNights = (start: string, end: string): number => {
        if (!start || !end) return 0;
        const startDate = new Date(start);
        const endDate = new Date(end);

        // Reset hours to 0 to ensure calculation is based purely on the date
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Calculate the difference in milliseconds
        const timeDiff = endDate.getTime() - startDate.getTime();

        // Convert milliseconds to days (1000ms * 60s * 60min * 24hr)
        const dayDiff = timeDiff / (1000 * 3600 * 24);

        // Return the number of nights, ensuring it's a positive integer
        return dayDiff > 0 ? Math.floor(dayDiff) : 0;
    };

    const numberOfNights = useMemo(() => calculateNights(checkInDate, checkOutDate), [checkInDate, checkOutDate]);

    const totalPriceForStay = numberOfNights * (room?.pricePerNight || 0);
    const finalPrice = totalPriceForStay > 0 ? totalPriceForStay : 0; 
    const checkIfDatesConflict = useCallback((): boolean => {
        if (!checkInDate || !checkOutDate || numberOfNights === 0) {
            return false;
        }

        const newStart = new Date(checkInDate).getTime();
        const newEnd = new Date(checkOutDate).getTime();

        for (const range of bookedRanges) {
            const existingStart = new Date(range.start).getTime();
            const existingEnd = new Date(range.end).getTime();

            const isConflict = newStart < existingEnd && existingStart < newEnd;
            
            if (isConflict) {
                return true;
            }
        }
        return false;
    }, [checkInDate, checkOutDate, numberOfNights, bookedRanges]);
    
    const hasConflict = checkIfDatesConflict();

    // 3. REPLACE ALERTS WITH TOASTS IN VALIDATION
    const validateBookingDates = (): boolean => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkIn < today) {
            addToast('Invalid Date', 'Check-in date cannot be in the past.', 'error');
            return false;
        }

        if (checkOut <= checkIn) {
            addToast('Invalid Date', 'Check-out date must be after the check-in date.', 'error');
            return false;
        }

        return true;
    };

    // Booking action with validation
    const handleBookNow = async () => {
        if (!room) return;

        if (!isLoggedIn) {
            console.error("You must be logged in to make a booking.");
            addToast('Login Required', 'Please sign in to proceed with your booking.', 'info');
            return;
        }

		if (!validateBookingDates()) {
			return;
		}

		// Check if user is logged in and token exists
		const token = localStorage.getItem('token');
		if (!isLoggedIn || !token) {
			addToast('Login Required', 'You must be logged in to make a booking.', 'error');
			return;
		}

		if (numberOfNights === 0 || hasConflict || !room.isAvailable) {
			console.error("Booking conflict, invalid dates, or room unavailable.");
			setBookingError('This room is unavailable for the selected dates. Please choose different dates.');
			addToast('Unavailable', 'This room is unavailable for the selected dates.', 'error');
			return;
		}

		// Clear any previous booking error if proceeding
		setBookingError('');
		try {
			const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
			const bookingData = {
				room: room._id,
				checkInDate,
				checkOutDate,
				totalGuests: guests,
				totalPrice: finalPrice,
			};

			const response = await axios.post(`${apiBaseUrl}/api/bookings`, bookingData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			console.log('Booking successful:', response.data);
			const successMessage = `Confirmed for ${numberOfNights} night(s) at $${finalPrice.toFixed(2)}.`;
			addToast('Booking Confirmed! 🎉', successMessage, 'success');
			setBookedRanges((prev) => [...prev, { start: checkInDate, end: checkOutDate }]);
			setCheckInDate('');
			setCheckOutDate('');
			setGuests(1);

			// Dispatch a custom event to notify MyBookings to refresh
			window.dispatchEvent(new Event('bookingUpdated'));
		} catch (error: any) {
			console.error('Error creating booking:', error.response?.data || error.message);
			let friendlyMessage = 'Failed to create booking. Please try again.';
			if (error.response?.data?.error) {
				const err = error.response.data.error.toLowerCase();
				if (err.includes('conflict') || err.includes('unavailable')) {
					friendlyMessage = 'The room is not available for the selected dates. Please choose different dates.';
				} else if (err.includes('token')) {
					friendlyMessage = 'Your session has expired or you are not logged in. Please log in and try again.';
				} else if (err.includes('validation')) {
					friendlyMessage = 'Some booking details are invalid. Please check your dates and guest information.';
				} else {
					friendlyMessage = error.response.data.error;
				}
			} else if (error.response?.data?.message) {
				friendlyMessage = error.response.data.message;
			}
			addToast('Booking Failed', friendlyMessage, 'error');
			setBookingError(friendlyMessage);
		}
    };


	// --- Inline error message for unavailable dates ---
	const [bookingError, setBookingError] = useState<string>('');

	if (loading) {
	return (
		<>
			{/* ...existing code for room details and booking form... */}
			{/* Place this below the date pickers in your booking form UI */}
			{bookingError && (
				<div className="text-red-600 text-sm mt-2 mb-2 font-semibold" data-testid="booking-error-msg">
					{bookingError}
				</div>
			)}
			{/* ...existing code for the rest of the component... */}
		</>
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
    
    const hasValidDates = numberOfNights > 0; // Check validity based on calculated nights
    
    // Button is disabled if: not logged in OR invalid dates OR there is a conflict OR room is unavailable
    const isBookButtonDisabled = !isLoggedIn || !hasValidDates || hasConflict || !room.isAvailable;
    let buttonText = 'Book Now';
    
    if (!isLoggedIn) {
        buttonText = 'Login to Book';
    } else if (hasConflict || !room.isAvailable) {
        buttonText = 'Unavailable';
    } else if (!hasValidDates) {
        buttonText = 'Select Dates';
    }


    return (
        <div className={`max-w-7xl mx-auto px-4 md:px-8 py-10 bg-white`}>
            {/* 1. ROOM HEADER AND PHOTO */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h1 className='text-4xl md:text-5xl font-extrabold text-[var(--color-brand-navy)] tracking-tight'>
                        {room.title}
                    </h1>
                    <div className="flex items-center gap-1 mt-2 md:mt-0 text-lg font-semibold">
                        <Star className='w-6 h-6 text-[var(--color-brand-gold)] fill-[var(--color-brand-gold)]' />
                        <span>{room.rating ? room.rating.toFixed(1) : "N/A"}</span>
                        <span className="text-gray-500 font-normal">
                            ({room.reviewCount || 0} reviews)
                        </span>
                        {(room as any).isTopRated && ( 
                            <span className='bg-[var(--color-brand-navy)] text-white px-2 py-0.5 rounded-full text-xs font-semibold ml-2'>
                                Top Rated
                            </span >
                        )}
                    </div>
                </div>
                
                {/* Sub-info Line */}
                <div className="flex items-center gap-3 text-gray-600 text-md border-b pb-4 border-dashed border-gray-200">
                    <Tag className='w-4 h-4 text-gray-500' />
                    <span className='text-[var(--color-brand-navy)] font-medium'>{room.type}</span>
                    <Users className='w-4 h-4 text-gray-500 ml-4' />
                    <span>Up to {room.maxPeople} Guests</span>
                </div>
            </div>

            {/* 2. MAIN CONTENT GRID */}
            <div className="grid lg:grid-cols-12 gap-10">

                <div className="lg:col-span-8 space-y-10">
                    
                    {/* Photo Carousel */}
                    {room.photos && room.photos.length > 0 && (
                        <div className="relative rounded-2xl overflow-hidden shadow-xl">
                            <img
                                src={room.photos[currentPhoto].url}
                                alt={room.title}
                                className="w-full h-96 md:h-[550px] object-cover transition duration-300"
                            />
                            {room.photos.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrevPhoto}
                                        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                                    >
                                        &#10094;
                                    </button>
                                    <button
                                        onClick={handleNextPhoto}
                                        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition"
                                    >
                                        &#10095;
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                    
                    {/* About This Room Section */}
                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4'>
                        <h2 className='text-3xl font-bold text-[var(--color-brand-navy)]'>About This Room</h2>
                        <p className="text-gray-700 text-lg leading-relaxed">{room.description}</p>
                    </div>
                    
                    {/* Amenities Section */}
                    {room.amenities && room.amenities.length > 0 && (
                        <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                            <h2 className='text-3xl font-bold mb-4 text-[var(--color-brand-navy)]'>Room Amenities</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4">
                                {room.amenities.map((amenity, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 text-gray-700 text-lg"
                                    >
                                        <AmenityIcon name={amenity} />
                                        <span className='font-medium'>{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Placeholder for Guest Reviews */}
                    <div className='bg-white p-6 rounded-xl border border-gray-100 shadow-sm'>
                        <h2 className='text-3xl font-bold mb-4 text-[var(--color-brand-navy)]'>Guest Reviews</h2>
                        <div className="text-gray-500">
                            <p>No reviews yet. Be the first to share your experience!</p>
                        </div>
                    </div>

                </div>

                {/* RIGHT COLUMN: BOOKING WIDGET (Lg: 4/12) */}
                <div className="lg:col-span-4 lg:sticky lg:top-8 self-start">
                    
                    <div className='bg-[var(--color-background-light)] rounded-xl p-6 shadow-lg border border-gray-200 space-y-6'>
                        <div className='text-center py-2 border-b border-gray-300'>
                            <span className='text-3xl font-bold text-[var(--color-brand-navy)]'>
                                ${room.pricePerNight}
                            </span>
                            <span className="text-gray-600 ml-1">/ night</span>
                        </div>
                        
                        {/* Booking Inputs */}
                        <div className='space-y-4'>
                            {/* Check-in Date */}
                            <div className="relative">
                                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-brand-gold)]' />
                                <input
                                    type="date"
                                    min={today} 
                                    value={checkInDate}
                                    onChange={(e) => setCheckInDate(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-[var(--color-brand-gold)] transition duration-150 text-[var(--color-brand-navy)] font-medium'
                                    placeholder="Check-in"
                                />
                            </div>
                            {/* Check-out Date */}
                            <div className="relative">
                                <Calendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-brand-gold)]' />
                                <input
                                    type="date"
                                    min={checkInDate || today} // Check-out must be after check-in
                                    value={checkOutDate}
                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-[var(--color-brand-gold)] transition duration-150 text-[var(--color-brand-navy)] font-medium'
                                    placeholder="Check-out"
                                    disabled={!checkInDate}
                                />
                            </div>
                            {/* Guests */}
                            <div className="relative">
                                <GuestIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-brand-gold)]' />
                                <select
                                    value={guests}
                                    onChange={(e) => setGuests(Number(e.target.value))}
                                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-[var(--color-brand-gold)] focus:border-[var(--color-brand-gold)] transition duration-150 text-[var(--color-brand-navy)] font-medium'
                                    disabled={!room.isAvailable}
                                >
                                    {Array.from({ length: room.maxPeople }, (_, i) => i + 1).map(num => (
                                        <option key={num} value={num}>
                                            {num} Guest{num > 1 ? 's' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        {/* --- Price Calculation Breakdown --- */}
                        {numberOfNights > 0 && (
                            <div className="space-y-3 pt-4 border-t border-gray-300">
                                {/* Base Price Calculation */}
                                <div className="flex justify-between text-gray-700">
                                    <span className='font-normal'>
                                        ${room.pricePerNight.toFixed(2)} x {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
                                    </span>
                                    <span className='font-medium'>
                                        ${totalPriceForStay.toFixed(2)}
                                    </span>
                                </div>
                                {/* Final Total Price */}
                                <div className="flex justify-between pt-3 border-t border-gray-400 text-xl font-bold text-[var(--color-brand-navy)]">
                                    <span>Total Price</span>
                                    <span>${finalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        )}

                        {/* Book Now Button */}
                        <button
                            onClick={handleBookNow}
                            disabled={isBookButtonDisabled}
                            className={`
                                w-full py-3 rounded-xl text-lg font-semibold transition-all duration-300
                                ${!isBookButtonDisabled
                                    // Gold background, Navy text, Gold hover
                                    ? 'bg-[var(--color-brand-gold)] text-[var(--color-brand-navy)] hover:bg-[var(--color-brand-gold-hover)] shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                                }
                            `}
                        >
                            {buttonText}
                        </button>
                        
                        <p className="text-center text-sm text-gray-500">
                            {isLoggedIn ? `Calculated for ${numberOfNights} night(s).` : 'Login required to proceed with booking.'}
                        </p>
                        
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default RoomDetail;