import React from "react";
import SearchForm from "../Search/SearchForm";

interface HeaderProps {
  type?: "list" | "home";
}

const Header: React.FC<HeaderProps> = ({ type = "home" }) => {
  const isHomePage = type === "home";

  return (
    <header
      className={`
        bg-cover bg-center bg-no-repeat text-black
        ${isHomePage ? "pb-20" : "pb-8 pt-4"}
      `}
      style={{ backgroundImage: "url('/assets/dashboardImg.png')" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {isHomePage && (
          <div className="pt-16 pb-12 text-center padding-x-4">
            {/* Fade-in animation for the title */}
            <h1
              className="
                text-5xl md:text-6xl font-extrabold mb-4 
                tracking-tight leading-tight
                opacity-0 animate-fade-in
              "
            >
              Book your next{" "}
              <span className="text-[#FFFFFF]">unforgettable stay.</span>
            </h1>

            {/* Typing animation for the subtitle */}
            <p
              className="
                text-lg md:text-xl font-medium mb-8 
                text-[#FFFFFF] max-w-3xl mx-auto 
                overflow-hidden whitespace-nowrap border-r-[3px] border-[#ffffff]
                opacity-0 animate-typing inline-block
              "
              style={{
                animationDelay: "1.5s",
              }}
            >
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