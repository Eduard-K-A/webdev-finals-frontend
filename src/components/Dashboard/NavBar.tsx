import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavBar: React.FC = () => {
  const location = useLocation();

  // Shared base style for all buttons
  const buttonBase =
    "inline-flex items-center justify-center h-9 px-4 py-2 rounded-full font-semibold transition-all duration-300 border border-[#f7e9dc]";

  // Function to dynamically apply active/hover styles
  const getButtonClass = (path: string) => {
    const isActive = location.pathname === path;
    return `${buttonBase} ${
      isActive
        ? "bg-[#d4a574] text-white" // Active (current page)
        : "bg-[#e0bd99] text-black hover:bg-[#d4a574] hover:text-white"
    }`;
  };

  return (
    <div className="z-10 sticky top-0 flex justify-between items-center py-3 text-black mx-auto bg-[#d4a574] w-full shadow-sm">
      {/* Left Section: LuxeStay brand */}
      <div className="ml-6 text-2xl font-bold">
        <Link
          to="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-black font-semibold transition-all duration-300"
        >
          LuxeStay
        </Link>
      </div>

      {/* Middle Section: Navigation Links */}
      <div className="space-x-4">
        <Link to="/" className={getButtonClass("/")}>
          Home
        </Link>
        <Link to="/Room" className={getButtonClass("/Room")}>
          Rooms
        </Link>
      </div>

      {/* Right Section: Auth Buttons */}
      <div className="space-x-4 mr-6">
        <Link to="/Register" className={getButtonClass("/Register")}>
          Register
        </Link>
        <Link to="/SignIn" className={getButtonClass("/SignIn")}>
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
