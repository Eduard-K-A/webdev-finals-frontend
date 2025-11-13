import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Hotel, LogIn, LogOut } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";
import AdminNavBar from "./AdminNavBar";

const NavBar: React.FC = () => {
  const location = useLocation();
  const { isLoggedIn, isAdmin, user, logout } = useAuth();

  console.log("User Role:", user?.role);
  
  // Show admin navbar if user is logged in as admin
  if (isLoggedIn && isAdmin) {
    return <AdminNavBar />;
  }
  
  // Function to dynamically apply active/hover styles for links
  const getLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `
      text-base font-medium transition-colors duration-200 
      ${isActive
          ? `text-[#d4a574] border-b-2 border-[#d4a574] font-semibold` // Active: Gold underline
          : "text-gray-700 hover:text-[#1f1f1f]" // Default/Hover: Dark text
      }`;
  };

  const handleLogout = () => {
    logout();
  };
  

  return (
    <div className={`sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm px-8 py-3`}>
      <div className="flex justify-between items-center h-full">
        
        {/* 1. Logo & Brand Section (Left) */}
        <div className="flex items-center gap-2 cursor-pointer ml-20">
          <Hotel className={`h-8 w-8 text-[#0a1e3d]`} />
          
          <Link to="/" className={`text-xl text-[#0a1e3d] font-medium`}>
            LuxeStay
          </Link>
        </div>

        {/* 2. Navigation Links Section (Middle) */}
        <nav className="hidden md:flex items-center gap-6 h-full">
          <Link to="/" className={getLinkClass("/")}>
            Home
          </Link>
          <Link to="/Rooms" className={getLinkClass("/Rooms")}>
            Rooms
          </Link>
        </nav>

        {/* 3. Auth Button Section (Right Side) */}
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome, {user?.firstName}!
              </span>
              <button 
                onClick={handleLogout}
                className={`
                  inline-flex items-center justify-center h-10 px-6 rounded-full 
                  text-sm font-medium transition-all duration-300 shadow-md 
                  text-white bg-red-600 hover:bg-red-700 
                  space-x-2
                `}
              >
                <LogOut className="h-4 w-4" /> 
                <span>Logout</span>
              </button>
            </>
          ) : (
            <Link 
              to="/SignIn" 
              className={`
                inline-flex items-center justify-center h-10 px-6 rounded-full 
                text-sm font-medium transition-all duration-300 shadow-md 
                text-[#0a1e3d] bg-[#d4a574] hover:bg-[#c19563] 
                space-x-2
              `}
            >
              <LogIn className="h-4 w-4" /> 
              <span>Log In / Register</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;