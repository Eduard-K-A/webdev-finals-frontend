
import React from 'react';
import SearchForm from '../Search/SearchForm';


interface HeaderProps {
    type?: "list" | "home"; // Allows different styles/layouts based on where it's used
}

const Header: React.FC<HeaderProps> = ({ type = "home" }) => {
    const isHomePage = type === "home";
    return (
        <header className={`
            bg-gray-500 text-black 
            ${isHomePage ? 'pb-20' : 'pb-8 pt-4'} 
        `}>
            <div className="max-w-7xl mx-auto px-4">
            
                {isHomePage && (
                    // Hero section with large, impactful typography
                    <div className="pt-16 pb-12 text-center padding-x-4">
                        <h1 className="
                            text-5xl md:text-6xl font-extrabold mb-4 
                            tracking-tight leading-tight
                        ">
                            Book your next <span className="text-yellow-400">unforgettable stay.</span>
                        </h1>
                        <p className="
                            text-lg md:text-xl font-light mb-8 
                            text-gray-300 max-w-3xl mx-auto
                        ">
                            Reserve and explore the best hotels worldwide with ease and convenience!
                        </p>
                    </div>
                )}
            </div>
        
            {isHomePage && <SearchForm />} 
        </header>
    );
};

export default Header;