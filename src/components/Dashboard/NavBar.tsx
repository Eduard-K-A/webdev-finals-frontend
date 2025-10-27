import React from "react";
import { Link } from "react-router-dom";

const NavBar: React.FC = () => {
  return (
    <div className="z-10 sticky top-0 flex justify-between items-center py-3 text-black mx-auto bg-white w-full shadow-sm">
      {/* Left Section: LuxeStay brand */}
      <div className="ml-6 text-2xl font-bold">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full  text-black font-semibold transition-all duration-300"
        >
          LuxeStay
        </Link>
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="space-x-4">
        <Link
          to="/"
          className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300"
        >
          Home
        </Link>
        <Link
          to="/Room"
          className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300"
        >
          Rooms
        </Link>
      </div>

      {/* Right Section: Auth Buttons */}
      <div className="space-x-4 mr-6">
        <Link
          to="/Register"
          className="bg-white text-black px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300"
        >
          Register
        </Link>
        <Link
          to="/SignIn"
          className="inline-flex items-center justify-center h-9 px-4 py-2 rounded-full bg-[#d4a574] hover:bg-[#c19563] text-black font-semibold transition-all duration-300"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
