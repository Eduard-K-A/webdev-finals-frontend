// src/pages/HomePage.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AwardSection from './AwardSection';
import FeaturedHotels from '../Hotels/FeaturedHotel';

const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-[#F7F1ED]">
            <Header type="home" />
        <main className="flex-grow">
                <AwardSection /> 
                <FeaturedHotels />
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;