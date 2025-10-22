
import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
    return (
        <div className="flex justify-between items-center py-4 px-8 text-black max-w-7xl mx-auto color-white">
            <div className="text-2xl font-bold">
                <Link to="/" className="hover:text-black-600 transition duration-300">
                    🏨 Hotel Booking
                </Link>
            </div>
            <div className="space-x-4">
                <button className="bg-white text-black-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-black-100 transition duration-300">
                    <Link to="/Register">Register</Link>
                </button>
                <button className="bg-white text-black-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300">
                   <Link to="/SignIn">Sign In</Link>
                </button>
            </div>
        </div>
    );
};

export default NavBar;