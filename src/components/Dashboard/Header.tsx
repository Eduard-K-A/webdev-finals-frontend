import React from "react";
import { MapPin, Calendar, Users, type LucideIcon } from 'lucide-react'; 

interface HeaderProps {
  type?: "list" | "home";
}

// Define the correct types for SearchInput props
interface SearchInputProps {
  icon: LucideIcon;
  placeholder: string;
  type?: string;
}

const COLORS = {
  NAVY_DARK: '#0a1e3d',
  GOLD_PRIMARY: '#d4a574',
  GOLD_HOVER: '#c19563',
  BORDER_GRAY: '#D1D5DB',
};
const HERO_IMAGE_URL = '/assets/dashboardImg.png';

// --- Search Input Component ---
const SearchInput: React.FC<SearchInputProps> = ({ icon: Icon, placeholder, type = 'text' }) => {
  const inputStyleClasses = 'w-full px-4 py-1.5 text-sm bg-white border border-[' + COLORS.BORDER_GRAY + '] rounded-xl focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-gray-300 focus:border-transparent outline-none transition-all';
  const iconColor = `text-[${COLORS.NAVY_DARK}]/60`; // text-[#0a1e3d]/60

  return (
    <div className="relative flex items-center col-span-1">
      <Icon className={`h-4 w-4 absolute left-3 pointer-events-none ${iconColor}`} />
      <input
        type={type}
        placeholder={placeholder}
        className={`${inputStyleClasses} pl-10`} 
      />
    </div>
  );
};

// --- Search Form Component ---
const SearchForm = () => {
    const goldBg = `bg-[${COLORS.GOLD_PRIMARY}]`;
    const goldHover = `hover:bg-[${COLORS.GOLD_HOVER}]`;
    const navyText = `text-[${COLORS.NAVY_DARK}]`;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Searching for hotel availability...");
    };

    return (
        <form onSubmit={handleSubmit} className="p-0">
            {/* Input Grid: grid-cols-1 md:grid-cols-4, gap-4 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <SearchInput icon={MapPin} placeholder="Destination" />
                <SearchInput icon={Calendar} placeholder="Check-in" type="date" />
                <SearchInput icon={Calendar} placeholder="Check-out" type="date" />
                <SearchInput icon={Users} placeholder="Guests" type="number" />
            </div>
            
            {/* Search Button */}
            <button
              type="submit"
              className={`w-full mt-4 py-1.5 text-sm font-semibold ${goldBg} ${goldHover} ${navyText} rounded-xl h-10 transition-colors duration-200`}
            >
              Search Availability
            </button>
        </form>
    );
}

// --- Header Component ---
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
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-left"> 
        
        <div className="max-w-3xl pt-16 pb-12 text-left"> 
          
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
        <div className="w-full max-w-3xl opacity-0 animate-fade-in" style={{ animationDelay: "1.2s", animationDuration: '0.8s' }}> 
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