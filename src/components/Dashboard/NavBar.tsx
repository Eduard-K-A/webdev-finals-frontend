  import React from "react";
  import { Link, useLocation } from "react-router-dom";
  import { Hotel, LogIn } from 'lucide-react'; 

  // --- Color Constants based on Spec ---
  const NAV_BG_COLOR = "bg-white"; 
  const NAV_BORDER_COLOR = "border-gray-200"; 
  const BRAND_NAVY = "#0a1e3d"; 
  const BRAND_GOLD = "#d4a574"; 
  const BUTTON_HOVER_GOLD = "#c19563";

  const NavBar: React.FC = () => {
    const location = useLocation();
    
    // Function to dynamically apply active/hover styles for links
    const getLinkClass = (path: string) => {
      const isActive = location.pathname === path;
      return `
        text-base font-medium transition-colors duration-200 
        ${isActive
            ? `text-[${BRAND_GOLD}] border-b-2 border-[${BRAND_GOLD}] font-semibold` // Active: Gold underline
            : "text-gray-700 hover:text-[#1f1f1f]" // Default/Hover: Dark text
        }`;
    };

    return (
      <div className={`sticky top-0 z-50 w-full ${NAV_BG_COLOR} border-b ${NAV_BORDER_COLOR} shadow-sm px-8 py-3`}>
        <div className="flex justify-between items-center h-full">
          
          {/* 1. Logo & Brand Section (Left) */}
          <div className="flex items-center gap-2 cursor-pointer ml-20">
            <Hotel className={`h-8 w-8 text-[${BRAND_NAVY}]`} />
            
            <Link to="/" className={`text-xl text-[${BRAND_NAVY}] font-medium`}>
              LuxeStay
            </Link>
          </div>

          {/* 2. Navigation Links Section (Middle) */}
          <nav className="hidden md:flex items-center gap-6 h-full">
            <Link to="/" className={getLinkClass("/")}>
              Home
            </Link>
            <Link to="/Hotels/Search" className={getLinkClass("/Hotels/Search")}>
              Rooms
            </Link>
          </nav>

          {/* 3. Auth Button Section (Right Side) */}
          <div className="space-x-4">
            <Link 
              to="/SignIn" 
              className={`
                inline-flex items-center justify-center h-10 px-6 rounded-full 
                text-sm font-medium transition-all duration-300 shadow-md 
                text-[${BRAND_NAVY}] bg-[${BRAND_GOLD}] hover:bg-[${BUTTON_HOVER_GOLD}] 
                space-x-2
              `}
            >
              <LogIn className="h-4 w-4" /> 
              <span>Log In / Register</span>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  export default NavBar;