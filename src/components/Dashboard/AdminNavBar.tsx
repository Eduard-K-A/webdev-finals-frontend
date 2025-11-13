import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Hotel, LogOut, LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from "../../context/AuthContext";

const AdminNavBar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
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
    <div className={`sticky top-0 z-50 w-full bg-white border-b-2 border-[#d4a574] shadow-sm px-8 py-3`}>
      <div className="flex justify-between items-center h-full">
        
        {/* 1. Logo & Brand Section (Left) */}
        <div className="flex items-center gap-2 cursor-pointer ml-20">
          <Hotel className={`h-8 w-8 text-[#d4a574]`} />
          
          <Link to="/" className={`text-xl text-[#0a1e3d] font-bold`}>
            LuxeStay <span className="text-xs text-[#d4a574] font-semibold">ADMIN</span>
          </Link>
        </div>

        {/* 2. Navigation Links Section (Middle) */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          <Link to="/" className={getLinkClass("/")}>
            <LayoutDashboard className="w-4 h-4 inline mr-2" />
            Dashboard
          </Link>
          <Link to="/Rooms" className={getLinkClass("/Rooms")}>
            <Hotel className="w-4 h-4 inline mr-2" />
            Rooms
          </Link>
          <Link to="/ManageRoom" className={getLinkClass("/ManageRoom")}>
            <Hotel className="w-4 h-4 inline mr-2" />
            Manage Rooms
          </Link>
          <Link to="/Users" className={getLinkClass("/Users")}>
            <Users className="w-4 h-4 inline mr-2" />
            Users
          </Link>
        </nav>

        {/* 3. User Info & Logout Section (Right Side) */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
            <span className="text-gray-700">Admin: <span className="font-semibold text-[#0a1e3d]">{user?.firstName} {user?.lastName}</span></span>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};

export default AdminNavBar;
