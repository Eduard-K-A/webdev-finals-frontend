import React from "react";
import { useNavigate } from 'react-router-dom'; 

interface HeaderProps {
  type?: "list" | "home";
}

const HERO_IMAGE_URL = '/assets/dashboardImg.png';

// --- Search Form Component (FINAL CTA LAYOUT) ---
const SearchForm = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Navigating to rooms page...");
        // Navigate to the rooms page when the button is clicked
        navigate('/Rooms'); 
    };

    return (
        <form onSubmit={handleSubmit} className="p-0">
            
            {/* UPDATED PHRASE & SIZE */}
            <h4 className="text-[#0a1e3d] text-l font-medium text-center mb-4">
                Browse our collection of curated rooms and reserve your perfect stay today.
            </h4>

            {/* Explore Rooms Button */}
            <button
              type="submit"
              className={`
                  w-full h-10 py-1.5 text-lg font-semibold 
                  bg-[#d4a574] hover:bg-[#c19563] 
                  text-[#0a1e3d] rounded-xl transition-colors duration-200
              `}
            >
              Explore Our Rooms
            </button>
        </form>
    );
}

// --- Header Component (Layout Change) ---
const Header: React.FC<HeaderProps> = ({ type = "home" }) => {
  const isHomePage = type === "home";

  if (!isHomePage) {
    // LIST/DEFAULT HEADER MODE
    return (
      <header
        className="bg-cover bg-center bg-no-repeat text-black pb-8 pt-4"
        style={{ backgroundImage: `url(${HERO_IMAGE_URL})` }}
      >
        <div className="max-w-7xl mx-auto px-4">
        </div>
      </header>
    );
  }

  return (
    // 1. Main container
    <header className="relative w-full h-[600px] overflow-hidden">
      
      {/* 2. Background Image */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        src={HERO_IMAGE_URL}
        alt="Hotel Lobby Background"
      />

      {/* 3. Overlay*/}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-[#1a2a4a]/55 to-[#1a2a4a]/20`} // Softened navy-like color, reduced opacity
      />

      {/* 4. Content Container */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center"> 
        
        <div className="max-w-3xl pt-16 pb-12 text-center"> 
          
          <h1
            className={`
              text-white text-5xl md:text-6xl font-medium mb-4 
              tracking-tight leading-tight
              opacity-0 animate-fade-in 
            `}
            style={{ animationDuration: '0.8s' }} 
          >
            Experience Luxury Redefined
          </h1>

          <p
            className={`
              text-white/90 text-xl font-medium mb-8 
              opacity-0 animate-fade-in 
            `}
            style={{
                animationDelay: "0.5s", 
                animationDuration: '1.0s',
            }}
          >
            Your perfect escape awaits at the world's finest boutique hotel
          </p>
        </div>
        
        {/* 5. Search Form Wrapper (The Floating Card)*/}
        {/* UPDATED: max-w-lg changed to max-w-3xl */}
        <div className="w-full max-w-3xl opacity-0 animate-slide-up-fade-in" style={{ animationDelay: "1.2s", animationDuration: '0.8s' }}> 
          <div 
            className="p-6 rounded-2xl shadow-xl bg-white"
          > 
            <SearchForm /> 
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;