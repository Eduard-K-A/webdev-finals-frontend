// src/components/Header/NavBar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    // Assuming you have a basic Tailwind setup (e.g., primary color)
    return (
        <div className="flex justify-between items-center py-4 px-8 text-white max-w-7xl mx-auto">
            <div className="text-2xl font-bold">
                <Link to="/" className="hover:text-gray-200 transition duration-300">
                    🏨 MERN Booking
                </Link>
            </div>
            <div className="space-x-4">
                <Link to="/my-bookings" className="text-sm font-medium hover:text-gray-200 hidden sm:inline-block">
                    My Bookings
                </Link>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300">
                    Register
                </button>
                <button className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300">
                    Sign In
                </button>
            </div>
        </div>
    );
};

export default NavBar;